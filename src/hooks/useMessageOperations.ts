
import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Conversation, Message } from "@/types/messaging";
import { fetchMessagesApi, markMessagesAsReadApi, sendMessageApi } from "@/utils/messagingApi";

export const useMessageOperations = (
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void,
  setSendingMessage: (sending: boolean) => void,
  activeConversation: Conversation | null,
  fetchConversations: (skipLoading?: boolean) => Promise<void>
) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user || !conversationId) return;
    
    try {
      console.log("Fetching messages for conversation:", conversationId);
      
      const { data: conversation } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single();
      
      if (!conversation) {
        console.log("Conversation not found:", conversationId);
        return;
      }
      
      const messagesData = await fetchMessagesApi(conversation);
      console.log("Messages data:", messagesData);
      
      setMessages(messagesData || []);
      
      // Mark messages as read
      if (messagesData && messagesData.length > 0) {
        const unreadMessages = messagesData.filter(
          msg => !msg.read && msg.receiver_id === user.id
        );
        
        if (unreadMessages.length > 0) {
          console.log("Marking messages as read:", unreadMessages.length);
          await markMessagesAsReadApi(unreadMessages.map(msg => msg.id));
          
          // Refresh conversations to update unread counts without changing UI state
          fetchConversations(true);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Erè",
        description: "Nou pa kapab chaje mesaj yo",
        variant: "destructive"
      });
    }
  }, [user, fetchConversations, toast, setMessages]);

  // Send a new message
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !activeConversation || !content.trim()) return;
    
    try {
      setSendingMessage(true);
      
      const receiverId = activeConversation.user1_id === user.id 
        ? activeConversation.user2_id 
        : activeConversation.user1_id;
      
      const messageData = await sendMessageApi(
        user.id,
        receiverId,
        content,
        activeConversation.id
      );
      
      // Add the new message to the state immediately
      if (messageData) {
        setMessages((prev: Message[]) => [...prev, messageData]);
      }
      
      return messageData;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erè",
        description: "Nou pa kapab voye mesaj la",
        variant: "destructive"
      });
      return null;
    } finally {
      setSendingMessage(false);
    }
  }, [user, activeConversation, toast, setMessages, setSendingMessage]);

  return {
    fetchMessages,
    sendMessage
  };
};
