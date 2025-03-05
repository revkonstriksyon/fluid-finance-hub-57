
import { useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { useDeviceInfo } from './useDeviceInfo';

export const useAuthStateChange = (
  fetchUserProfile: (userId: string) => Promise<void>,
  recordAuthActivity?: (userId: string, activityType: string, details: string, ipAddress?: string, deviceInfo?: string) => Promise<{ success: boolean, error: any | null }>,
  recordNewSession?: (userId: string, deviceInfo: string, location: string) => Promise<{ success: boolean, sessionId: string | null, error: any | null }>,
  terminateSession?: (sessionId: string) => Promise<{ success: boolean, error: any | null }>,
  getActiveSessions?: () => Promise<{ sessions: any[], error: any | null }>,
  getAuthActivity?: (userId: string, limit: string | number) => Promise<{ activities: any[], error: any | null }>
) => {
  const { getDeviceInfo, estimateLocation } = useDeviceInfo();

  const handleAuthChange = useCallback(async (event: string, user: User | null, currentSessionId: string | null) => {
    console.log("Auth state changed:", event, user?.id);
    
    if (user) {
      await fetchUserProfile(user.id);

      // For login events, record a new session
      if (event === 'SIGNED_IN' && recordNewSession) {
        console.log("User signed in, recording new session");
        const deviceInfo = getDeviceInfo();
        const location = await estimateLocation();
        const { sessionId } = await recordNewSession(
          user.id,
          deviceInfo,
          location
        );

        // Record login activity
        if (recordAuthActivity) {
          await recordAuthActivity(
            user.id,
            'login',
            'User logged in',
            undefined,
            deviceInfo
          );
        }

        // Load active sessions and auth activities
        if (getActiveSessions) {
          await getActiveSessions();
        }
        
        if (getAuthActivity) {
          await getAuthActivity(user.id, 10);
        }
        
        return sessionId;
      } 
    } else if (event === 'SIGNED_OUT') {
      console.log("User signed out");
      // Record logout activity if we still have the user ID
      if (currentSessionId && terminateSession) {
        await terminateSession(currentSessionId);
      }
      return null;
    }
    
    return currentSessionId;
  }, [fetchUserProfile, recordNewSession, recordAuthActivity, terminateSession, getActiveSessions, getAuthActivity, getDeviceInfo, estimateLocation]);

  return {
    handleAuthChange
  };
};
