
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessagingState } from "./useMessagingState";
import { useMessageOperations } from "./useMessageOperations";
import { useConversationOperations } from "./useConversationOperations";
import { useRealtimeHandler } from "./useRealtimeHandler";

export const useMessaging = () => {
  const { user } = useAuth();
  const {
    conversations,
    setConversations,
    activeConversation,
    setActiveConversation,
    messages,
    setMessages,
    loading,
    setLoading,
    sendingMessage,
    setSendingMessage,
    fetchingRef,
    activateConversationRef
  } = useMessagingState();

  // Initialize message operations first with a placeholder for fetchConversations
  // It will be properly set after conversation operations are initialized
  let messageOps: ReturnType<typeof useMessageOperations>;
  
  // Initialize conversation operations with appropriate dependencies
  const conversationOps = useConversationOperations(
    setConversations,
    setActiveConversation,
    activeConversation,
    fetchingRef,
    (conversationId: string) => messageOps.fetchMessages(conversationId),
    setLoading
  );
  
  // Now initialize message operations with the actual fetchConversations function
  messageOps = useMessageOperations(
    setMessages,
    setSendingMessage,
    activeConversation,
    conversationOps.fetchConversations
  );
  
  // Set up realtime handlers
  useRealtimeHandler(
    user?.id,
    activeConversation,
    messageOps.fetchMessages,
    conversationOps.fetchConversations
  );

  // Initial data fetch
  useEffect(() => {
    if (user) {
      conversationOps.fetchConversations();
    }
  }, [user, conversationOps]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation && activeConversation.id !== activateConversationRef.current) {
      activateConversationRef.current = activeConversation.id;
      messageOps.fetchMessages(activeConversation.id);
    }
  }, [activeConversation, messageOps, activateConversationRef]);

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    sendingMessage,
    setActiveConversation,
    fetchMessages: messageOps.fetchMessages,
    sendMessage: messageOps.sendMessage,
    createConversation: conversationOps.createConversation,
    fetchConversations: conversationOps.fetchConversations
  };
};
