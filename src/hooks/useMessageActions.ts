
import { useState, useCallback } from "react";
import { useMessaging } from "./useMessaging";
import { useToast } from "./use-toast";
import { Conversation } from "@/types/messaging";

export const useMessageActions = () => {
  const { toast } = useToast();
  const {
    activeConversation,
    sendMessage,
    createConversation
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

  return {
    newMessage,
    showNewMessageModal,
    setNewMessage,
    setShowNewMessageModal,
    handleSendMessage,
    startNewConversation,
    navigateToUserProfile
  };
};
