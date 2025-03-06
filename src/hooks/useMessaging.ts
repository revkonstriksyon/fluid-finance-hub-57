
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Message, Conversation } from "@/types/messaging";
import { useMessagingRealtime } from "./useMessagingRealtime";
import {
  fetchConversationsApi,
  fetchMessagesApi,
  markMessagesAsReadApi,
  sendMessageApi,
  createConversationApi
} from "@/utils/messagingApi";
import { enrichConversationData } from "@/utils/conversationHelpers";

export const useMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Use refs to prevent unnecessary re-renders
  const fetchingRef = useRef(false);
  const activateConversationRef = useRef<string | null>(null);

  // Fetch all conversations for the current user
  const fetchConversations = useCallback(async (skipLoading = false) => {
    if (!user || fetchingRef.current) return;
    
    try {
      if (!skipLoading) setLoading(true);
      fetchingRef.current = true;
      
      const conversationsData = await fetchConversationsApi(user.id);
      const enrichedConversations = await enrichConversationData(conversationsData, user.id);
      
      setConversations(enrichedConversations);
      
      // Set the first conversation as active if none is selected
      if (enrichedConversations.length > 0 && !activeConversation) {
        setActiveConversation(enrichedConversations[0]);
        activateConversationRef.current = enrichedConversations[0].id;
        await fetchMessages(enrichedConversations[0].id);
      } else if (activeConversation) {
        // Update the active conversation with new data without changing selection
        const updatedActiveConversation = enrichedConversations.find(
          conv => conv.id === activeConversation.id
        );
        
        if (updatedActiveConversation) {
          setActiveConversation(updatedActiveConversation);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Erè",
        description: "Nou pa kapab chaje konvèsasyon yo",
        variant: "destructive"
      });
    } finally {
      if (!skipLoading) setLoading(false);
      fetchingRef.current = false;
    }
  }, [user, activeConversation, toast]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user || !conversationId) return;
    
    try {
      const { data: conversation } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single();
      
      if (!conversation) return;
      
      const messagesData = await fetchMessagesApi(conversation);
      setMessages(messagesData || []);
      
      // Mark messages as read
      if (messagesData && messagesData.length > 0) {
        const unreadMessages = messagesData.filter(
          msg => !msg.read && msg.receiver_id === user.id
        );
        
        if (unreadMessages.length > 0) {
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
  }, [user, fetchConversations, toast]);

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
        setMessages(prev => [...prev, messageData]);
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
  }, [user, activeConversation, toast]);

  // Create a new conversation with another user
  const createConversation = useCallback(async (otherUserId: string) => {
    if (!user || user.id === otherUserId) return null;
    
    try {
      const newConversation = await createConversationApi(user.id, otherUserId);
      
      // Fetch the complete conversation with user profile
      await fetchConversations();
      
      const fullConversation = conversations.find(c => c.id === newConversation.id);
      if (fullConversation) {
        setActiveConversation(fullConversation);
        await fetchMessages(fullConversation.id);
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
  }, [user, fetchConversations, fetchMessages, conversations, toast]);

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
  useMessagingRealtime(user?.id, {
    onNewMessage: handleNewMessage,
    onConversationUpdate: useCallback(() => {
      fetchConversations(true);
    }, [fetchConversations])
  });

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation && activeConversation.id !== activateConversationRef.current) {
      activateConversationRef.current = activeConversation.id;
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation, fetchMessages]);

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    sendingMessage,
    setActiveConversation,
    fetchMessages,
    sendMessage,
    createConversation
  };
};
