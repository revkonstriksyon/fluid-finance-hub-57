
import { useState, useRef } from "react";
import { Conversation, Message } from "@/types/messaging";

export const useMessagingState = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Use refs to prevent unnecessary re-renders
  const fetchingRef = useRef(false);
  const activateConversationRef = useRef<string | null>(null);

  return {
    // State
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
    
    // Refs
    fetchingRef,
    activateConversationRef
  };
};
