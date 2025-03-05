
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { ActiveSession, AuthActivity } from '@/types/auth';

export const useSessionTracker = (
  user: User | null,
  getActiveSessions: ((userId?: string) => Promise<{ sessions: ActiveSession[], error: any | null }>) | undefined,
  getAuthActivity: ((userId?: string, limit?: string | number) => Promise<{ activities: AuthActivity[], error: any | null }>) | undefined,
  terminateSession: ((sessionId: string) => Promise<{ success: boolean, error: any | null }>) | undefined,
  terminateAllSessions: ((userId: string, currentSessionId: string) => Promise<{ success: boolean, error: any | null }>) | undefined,
  recordAuthActivity: ((userId: string, activityType: string, details: string, ipAddress?: string, deviceInfo?: string) => Promise<{ success: boolean, error: any | null }>) | undefined
) => {
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [authActivities, setAuthActivities] = useState<AuthActivity[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Function to fetch active sessions
  const fetchActiveSessions = async () => {
    if (user && getActiveSessions) {
      const { sessions, error } = await getActiveSessions(user.id);
      if (!error) {
        setActiveSessions(sessions);
      }
      return { sessions, error };
    }
    return { sessions: [], error: null };
  };

  // Function to fetch auth activities
  const fetchAuthActivity = async (userId?: string, limit?: string | number) => {
    if (user && getAuthActivity) {
      // If limit is a number, convert it to string
      const limitStr = limit !== undefined ? limit.toString() : undefined;
      const { activities, error } = await getAuthActivity(
        userId || user.id, 
        limitStr
      );
      if (!error) {
        setAuthActivities(activities);
      }
      return { activities, error };
    }
    return { activities: [], error: null };
  };

  // Function to terminate a session
  const handleTerminateSession = async (sessionId: string) => {
    if (terminateSession) {
      const result = await terminateSession(sessionId);
      if (result.success) {
        // Refresh sessions list
        await fetchActiveSessions();
        // Record activity
        if (user && recordAuthActivity) {
          await recordAuthActivity(
            user.id,
            'session_terminated',
            `Session ${sessionId} terminated`
          );
        }
      }
      return result;
    }
    return { success: false, error: new Error('terminateSession not available') };
  };

  // Function to terminate all other sessions
  const handleTerminateAllSessions = async () => {
    if (user && currentSessionId && terminateAllSessions) {
      const result = await terminateAllSessions(user.id, currentSessionId);
      if (result.success) {
        // Refresh sessions list
        await fetchActiveSessions();
        // Record activity
        if (recordAuthActivity) {
          await recordAuthActivity(
            user.id,
            'all_sessions_terminated',
            'All other sessions terminated'
          );
        }
      }
      return result;
    }
    return { success: false, error: new Error('terminateAllSessions not available') };
  };

  return {
    activeSessions,
    authActivities,
    currentSessionId,
    setCurrentSessionId,
    getActiveSessions: fetchActiveSessions,
    getAuthActivity: fetchAuthActivity,
    terminateSession: handleTerminateSession,
    terminateAllSessions: handleTerminateAllSessions
  };
};
