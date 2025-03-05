
import { User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { ActiveSession, AuthActivity } from '@/types/auth';

type AuthActionsProps = {
  user: User | null;
  refreshUserProfile: (userId: string) => Promise<void>;
  getActiveSessions?: (userId: string) => Promise<{ sessions: ActiveSession[], error: any | null }>;
  getAuthActivity?: (userId: string, limit?: string | number) => Promise<{ activities: any[], error: any | null }>;
  terminateSession?: (sessionId: string) => Promise<{ success: boolean, error: any | null }>;
  terminateAllSessions?: (userId: string, currentSessionId: string) => Promise<{ success: boolean, error: any | null }>;
  recordAuthActivity?: (userId: string, activityType: string, details: string, ipAddress?: string, deviceInfo?: string) => Promise<{ success: boolean, error: any | null }>;
  setActiveSessions: (sessions: ActiveSession[]) => void;
  setAuthActivities: (activities: AuthActivity[]) => void;
  currentSessionId: string | null;
};

export function useAuthActions({
  user,
  refreshUserProfile,
  getActiveSessions: getActiveSessionsOp,
  getAuthActivity: getAuthActivityOp,
  terminateSession: terminateSessionOp,
  terminateAllSessions: terminateAllSessionsOp,
  recordAuthActivity,
  setActiveSessions,
  setAuthActivities,
  currentSessionId
}: AuthActionsProps) {
  const { toast } = useToast();

  // Wrapper for refresh profile to use with the current user
  const refreshProfile = async () => {
    if (user) {
      await refreshUserProfile(user.id);
      toast({
        title: "Done yo aktyalize",
        description: "Done pwofil ou yo te aktyalize avèk siksè.",
      });
    }
  };

  // Function to fetch active sessions
  const getActiveSessions = async () => {
    if (user && getActiveSessionsOp) {
      const { sessions, error } = await getActiveSessionsOp(user.id);
      if (!error) {
        setActiveSessions(sessions);
      }
      return { sessions, error };
    }
    return { sessions: [], error: null };
  };

  // Function to fetch auth activities
  const getAuthActivity = async (userId?: string, limit?: string | number) => {
    if (user && getAuthActivityOp) {
      const limitStr = limit !== undefined ? limit.toString() : undefined;
      const { activities, error } = await getAuthActivityOp(
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
  const terminateSession = async (sessionId: string) => {
    if (terminateSessionOp) {
      const result = await terminateSessionOp(sessionId);
      if (result.success) {
        await getActiveSessions();
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
  const terminateAllSessions = async () => {
    if (user && currentSessionId && terminateAllSessionsOp) {
      const result = await terminateAllSessionsOp(user.id, currentSessionId);
      if (result.success) {
        await getActiveSessions();
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
    refreshProfile,
    getActiveSessions,
    getAuthActivity,
    terminateSession,
    terminateAllSessions
  };
}
