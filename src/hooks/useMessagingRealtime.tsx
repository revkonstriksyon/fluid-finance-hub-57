
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
    
    // Use a single channel for all message-related subscriptions to prevent multiple connections
    const channel = supabase
      .channel('messaging-events')
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
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onNewMessage, onConversationUpdate]);
};
