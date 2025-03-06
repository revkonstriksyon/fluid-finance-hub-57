
import { useEffect, useCallback } from 'react';
import { supabase } from "@/lib/supabase";

type RealtimeCallbacks = {
  onNewMessage: (payload?: any) => void;
  onConversationUpdate: (payload?: any) => void;
};

export const useMessagingRealtime = (
  userId: string | undefined,
  callbacks: RealtimeCallbacks
) => {
  const { onNewMessage, onConversationUpdate } = callbacks;
  
  // Set up real-time subscriptions
  useEffect(() => {
    if (!userId) return;
    
    // Use a single channel for all message-related subscriptions
    const channel = supabase
      .channel('messaging-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => {
          // Directly pass the payload to the callback
          onNewMessage(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => {
          onNewMessage(payload);
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
        (payload) => {
          onConversationUpdate(payload);
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
        (payload) => {
          onConversationUpdate(payload);
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onNewMessage, onConversationUpdate]);
};
