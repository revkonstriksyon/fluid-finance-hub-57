import { useState, useCallback } from "react";
import { useMessaging } from "./useMessaging";
import { useToast } from "./use-toast";
import { Conversation, Message } from "@/types/messaging";
import { supabase } from "@/lib/supabase";

export const useMessageActions = () => {
  const { toast } = useToast();
  const {
    activeConversation,
    sendMessage,
    createConversation,
    fetchConversations
  } = useMessaging();
  
  const [newMessage, setNewMessage] = useState("");
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  // Function to handle sending a message with optimistic UI update
  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim() === "" || !activeConversation) {
      return;
    }
    
    // Store message locally before sending to API
    const messageToSend = newMessage;
    
    // Clear the input field immediately for better UX
    setNewMessage("");
    
    try {
      // Send the message to the API
      await sendMessage(messageToSend);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erè",
        description: "Nou pa kapab voye mesaj la",
        variant: "destructive"
      });
      
      // Restore the message in the input if sending failed
      setNewMessage(messageToSend);
    }
  }, [newMessage, activeConversation, sendMessage, toast]);

  // Function to start a new conversation
  const startNewConversation = useCallback(async (userId: string) => {
    if (!userId) return null;
    
    try {
      const newConversation = await createConversation(userId);
      
      if (newConversation) {
        setShowNewMessageModal(false);
      }
      return newConversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Erè",
        description: "Nou pa kapab kreye yon nouvo konvèsasyon",
        variant: "destructive"
      });
      return null;
    }
  }, [createConversation, toast]);

  // Function to view a user's profile
  const navigateToUserProfile = useCallback((userId: string) => {
    window.location.href = `/profile/${userId}`;
  }, []);

  // Function to delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);
      
      if (error) throw error;
      
      toast({
        title: "Siksè",
        description: "Mesaj la siprime",
      });
      
      // No need to refresh manually as realtime will handle this
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Erè",
        description: "Nou pa kapab siprime mesaj la",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Function to delete a conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      // Delete all messages in the conversation first
      const { data: messagesData } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id")
        .or(`sender_id.eq.${activeConversation?.user1_id},sender_id.eq.${activeConversation?.user2_id}`)
        .or(`receiver_id.eq.${activeConversation?.user1_id},receiver_id.eq.${activeConversation?.user2_id}`);
      
      if (messagesData && messagesData.length > 0) {
        const messageIds = messagesData.map(msg => msg.id);
        
        // Delete messages in batches of 100 (Supabase limitation)
        const batchSize = 100;
        for (let i = 0; i < messageIds.length; i += batchSize) {
          const batch = messageIds.slice(i, i + batchSize);
          await supabase
            .from("messages")
            .delete()
            .in("id", batch);
        }
      }
      
      // Then delete the conversation
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);
      
      if (error) throw error;
      
      toast({
        title: "Siksè",
        description: "Konvèsasyon siprime",
      });
      
      // Refresh conversations list after deletion
      await fetchConversations();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Erè",
        description: "Nou pa kapab siprime konvèsasyon an",
        variant: "destructive"
      });
    }
  }, [activeConversation, fetchConversations, toast]);

  return {
    newMessage,
    showNewMessageModal,
    setNewMessage,
    setShowNewMessageModal,
    handleSendMessage,
    startNewConversation,
    navigateToUserProfile,
    deleteMessage,
    deleteConversation
  };
};
