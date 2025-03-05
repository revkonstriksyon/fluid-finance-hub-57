
import { useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { useDeviceInfo } from './useDeviceInfo';

export const useSessionInitialization = (
  fetchUserProfile: (userId: string) => Promise<void>,
  recordAuthActivity?: (userId: string, activityType: string, details: string, ipAddress?: string, deviceInfo?: string) => Promise<{ success: boolean, error: any | null }>,
  recordNewSession?: (userId: string, deviceInfo: string, location: string) => Promise<{ success: boolean, sessionId: string | null, error: any | null }>,
  getActiveSessions?: () => Promise<{ sessions: any[], error: any | null }>,
  getAuthActivity?: (userId: string, limit: string | number) => Promise<{ activities: any[], error: any | null }>
) => {
  const { getDeviceInfo, estimateLocation } = useDeviceInfo();

  const initializeUserSession = useCallback(async (user: User) => {
    console.log("Initializing user session for:", user.id);
    
    try {
      // Fetch profile data first
      await fetchUserProfile(user.id);
      
      let sessionId = null;
      
      // Record session for the user
      if (recordNewSession) {
        const deviceInfo = getDeviceInfo();
        const location = await estimateLocation();
        const sessionResult = await recordNewSession(
          user.id,
          deviceInfo,
          location
        );
        
        if (sessionResult.error) {
          console.error("Error recording new session:", sessionResult.error);
        } else {
          sessionId = sessionResult.sessionId;
          
          // Record login activity
          if (recordAuthActivity && sessionId) {
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
        }
      }
      
      return sessionId;
    } catch (error) {
      console.error("Error initializing user session:", error);
      // Even if there's an error, return null to allow the auth flow to continue
      return null;
    }
  }, [fetchUserProfile, recordNewSession, recordAuthActivity, getActiveSessions, getAuthActivity, getDeviceInfo, estimateLocation]);

  return {
    initializeUserSession
  };
};
