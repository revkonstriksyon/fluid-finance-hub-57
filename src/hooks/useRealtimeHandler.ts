
import { useCallback } from "react";
import { Conversation } from "@/types/messaging";
import { useMessagingRealtime } from "./useMessagingRealtime";

export const useRealtimeHandler = (
  userId: string | undefined,
  activeConversation: Conversation | null,
  fetchMessages: (conversationId: string) => Promise<void>,
  fetchConversations: (skipLoading?: boolean) => Promise<void>
) => {
  // Handle new messages via real-time updates
  const handleNewMessage = useCallback((payload: any) => {
    console.log("New message received:", payload);
    
    // Only fetch if the message is for the active conversation
    if (activeConversation) {
      const message = payload.new;
      
      if (message) {
        // If the message belongs to the active conversation, update messages
        const isForActiveConversation = 
          (activeConversation.user1_id === message.sender_id && activeConversation.user2_id === message.receiver_id) ||
          (activeConversation.user1_id === message.receiver_id && activeConversation.user2_id === message.sender_id);
        
        if (isForActiveConversation) {
          fetchMessages(activeConversation.id);
        }
      }
    }
    
    // Update conversations list to show new messages
    fetchConversations(true);
  }, [activeConversation, fetchMessages, fetchConversations]);

  // Set up realtime subscriptions
  useMessagingRealtime(userId, {
    onNewMessage: handleNewMessage,
    onConversationUpdate: useCallback(() => {
      fetchConversations(true);
    }, [fetchConversations])
  });
};
