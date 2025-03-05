
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';

export const useSessionHeartbeat = (
  user: User | null,
  sessionId: string | null,
  updateSessionActivity?: (sessionId: string) => Promise<{ success: boolean, error: any | null }>
) => {
  useEffect(() => {
    let heartbeatInterval: number;
    
    if (user && sessionId && updateSessionActivity) {
      // Update session activity every 5 minutes
      heartbeatInterval = window.setInterval(() => {
        updateSessionActivity(sessionId);
      }, 5 * 60 * 1000);
    }
    
    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, [user, sessionId, updateSessionActivity]);
};
