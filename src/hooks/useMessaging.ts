
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Message, Conversation } from "@/types/messaging";
import { useToast } from "@/hooks/use-toast";

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
      
      const { data: conversationsData, error: conversationsError } = await supabase
        .from("conversations")
        .select("*")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order("last_message_at", { ascending: false });
      
      if (conversationsError) throw conversationsError;
      
      // Fetch the other user's profile for each conversation
      const conversationsWithProfiles = await Promise.all(
        conversationsData.map(async (conversation) => {
          const otherUserId = conversation.user1_id === user.id 
            ? conversation.user2_id 
            : conversation.user1_id;
          
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, full_name, username, avatar_url")
            .eq("id", otherUserId)
            .single();
          
          // Get the last message for this conversation
          const { data: lastMessageData } = await supabase
            .from("messages")
            .select("content, created_at, read")
            .or(`sender_id.eq.${conversation.user1_id}.and.receiver_id.eq.${conversation.user2_id},sender_id.eq.${conversation.user2_id}.and.receiver_id.eq.${conversation.user1_id}`)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();
          
          return {
            ...conversation,
            otherUser: profileData ? { 
              ...profileData,
              // Simulate online status - in a real app, this would come from a presence system
              status: Math.random() > 0.5 ? "online" : (Math.random() > 0.5 ? "away" : "offline")
            } : undefined,
            lastMessage: lastMessageData || undefined
          };
        })
      );
      
      setConversations(conversationsWithProfiles);
      
      // Set the first conversation as active if none is selected
      if (conversationsWithProfiles.length > 0 && !activeConversation) {
        setActiveConversation(conversationsWithProfiles[0]);
        await fetchMessages(conversationsWithProfiles[0].id);
      } else if (activeConversation) {
        // Update the active conversation with new data
        const updatedActiveConversation = conversationsWithProfiles.find(
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
      
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${conversation.user1_id}.and.receiver_id.eq.${conversation.user2_id},sender_id.eq.${conversation.user2_id}.and.receiver_id.eq.${conversation.user1_id}`)
        .order("created_at", { ascending: true });
      
      if (messagesError) throw messagesError;
      
      setMessages(messagesData || []);
      
      // Mark messages as read
      if (messagesData && messagesData.length > 0) {
        const unreadMessages = messagesData.filter(
          msg => !msg.read && msg.receiver_id === user.id
        );
        
        if (unreadMessages.length > 0) {
          await supabase
            .from("messages")
            .update({ read: true })
            .in("id", unreadMessages.map(msg => msg.id));
          
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
      
      // Add message to database
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim()
        })
        .select()
        .single();
      
      if (messageError) throw messageError;
      
      // Update conversation last_message_at
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", activeConversation.id);
      
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
      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from("conversations")
        .select("*")
        .or(`user1_id.eq.${user.id}.and.user2_id.eq.${otherUserId},user1_id.eq.${otherUserId}.and.user2_id.eq.${user.id}`)
        .maybeSingle();
      
      if (existingConversation) {
        setActiveConversation(existingConversation);
        await fetchMessages(existingConversation.id);
        return existingConversation;
      }
      
      // Create new conversation
      const { data: newConversation, error: conversationError } = await supabase
        .from("conversations")
        .insert({
          user1_id: user.id,
          user2_id: otherUserId
        })
        .select()
        .single();
      
      if (conversationError) throw conversationError;
      
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

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        () => {
          // Refresh data when a new message is received
          fetchConversations();
          if (activeConversation) {
            fetchMessages(activeConversation.id);
          }
        }
      )
      .subscribe();
    
    // Subscribe to conversation updates
    const conversationsChannel = supabase
      .channel('public:conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user1_id=eq.${user.id}`
        },
        () => {
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user2_id=eq.${user.id}`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();
    
    // Initial data fetch
    fetchConversations();
    
    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, fetchConversations, fetchMessages, activeConversation]);

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
