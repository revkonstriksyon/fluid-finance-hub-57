
import { useEffect, useCallback } from 'react';
import { supabase } from "@/lib/supabase";

type RealtimeCallbacks = {
  onNewMessage: () => void;
  onConversationUpdate: () => void;
};

export const useMessagingRealtime = (
  userId: string | undefined,
  callbacks: RealtimeCallbacks
) => {
  const { onNewMessage, onConversationUpdate } = callbacks;
  
  // Set up real-time subscriptions
  useEffect(() => {
    if (!userId) return;
    
    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        () => {
          // Refresh data when a new message is received
          onNewMessage();
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
          filter: `user1_id=eq.${userId}`
        },
        () => {
          onConversationUpdate();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user2_id=eq.${userId}`
        },
        () => {
          onConversationUpdate();
        }
      )
      .subscribe();
    
    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
    };
  }, [userId, onNewMessage, onConversationUpdate]);
};
