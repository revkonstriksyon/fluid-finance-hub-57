
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/contexts/AuthContext';

export const usePostRealtime = (
  user: User | null, 
  onPostChange: () => void
) => {
  // Subscribe to realtime changes for posts
  useEffect(() => {
    if (!user) return;
    
    console.log('Setting up realtime subscriptions for posts');
    
    const channel = supabase
      .channel('posts-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' }, 
        (payload) => {
          console.log('Post change detected:', payload);
          onPostChange();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'post_likes' }, 
        (payload) => {
          console.log('Like change detected:', payload);
          onPostChange();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'post_comments' }, 
        (payload) => {
          console.log('Comment change detected:', payload);
          onPostChange();
        }
      )
      .subscribe();

    // Clean up on unmount
    return () => {
      console.log('Cleaning up realtime subscriptions');
      supabase.removeChannel(channel);
    };
  }, [user, onPostChange]);
};
