import { useState, useEffect, useCallback } from "react";
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

  // Fetch all conversations for the current user
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const conversationsData = await fetchConversationsApi(user.id);
      const enrichedConversations = await enrichConversationData(conversationsData, user.id);
      
      setConversations(enrichedConversations);
      
      // Set the first conversation as active if none is selected
      if (enrichedConversations.length > 0 && !activeConversation) {
        setActiveConversation(enrichedConversations[0]);
        await fetchMessages(enrichedConversations[0].id);
      } else if (activeConversation) {
        // Update the active conversation with new data
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
      setLoading(false);
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
          
          // Refresh conversations to update unread counts
          fetchConversations();
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
      
      // Refresh messages and conversations
      await fetchMessages(activeConversation.id);
      await fetchConversations();
      
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
  }, [user, activeConversation, fetchMessages, fetchConversations, toast]);

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

  // Set up realtime subscriptions through the custom hook
  useMessagingRealtime(user?.id, {
    onNewMessage: useCallback(() => {
      fetchConversations();
      if (activeConversation) {
        fetchMessages(activeConversation.id);
      }
    }, [fetchConversations, fetchMessages, activeConversation]),
    onConversationUpdate: fetchConversations
  });

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

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
