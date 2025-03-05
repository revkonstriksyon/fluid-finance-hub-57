import { useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { useToast } from '@/components/ui/use-toast';
import AuthContext from './AuthContext';
import { ActiveSession, AuthActivity } from '@/types/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [authActivities, setAuthActivities] = useState<AuthActivity[]>([]);
  const { toast } = useToast();
  
  const {
    profile,
    bankAccounts,
    userLoading,
    fetchUserProfile,
    refreshProfile: refreshUserProfile
  } = useProfileData();
  
  const authOperations = useAuthOperations();

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
    if (user && authOperations.getActiveSessions) {
      const { sessions, error } = await authOperations.getActiveSessions(user.id);
      if (!error) {
        setActiveSessions(sessions);
      }
      return { sessions, error };
    }
    return { sessions: [], error: null };
  };

  // Function to fetch auth activities
  const getAuthActivity = async (limit?: number) => {
    if (user && authOperations.getAuthActivity) {
      const { activities, error } = await authOperations.getAuthActivity(user.id, limit);
      if (!error) {
        setAuthActivities(activities);
      }
      return { activities, error };
    }
    return { activities: [], error: null };
  };

  // Function to terminate a session
  const terminateSession = async (sessionId: string) => {
    if (authOperations.terminateSession) {
      const result = await authOperations.terminateSession(sessionId);
      if (result.success) {
        // Refresh sessions list
        await getActiveSessions();
        // Record activity
        if (user && authOperations.recordAuthActivity) {
          await authOperations.recordAuthActivity(
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
    if (user && currentSessionId && authOperations.terminateAllSessions) {
      const result = await authOperations.terminateAllSessions(user.id, currentSessionId);
      if (result.success) {
        // Refresh sessions list
        await getActiveSessions();
        // Record activity
        if (authOperations.recordAuthActivity) {
          await authOperations.recordAuthActivity(
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

  // Function to handle device information collection
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const browserInfo = userAgent.match(/(chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i);
    const browser = browserInfo ? browserInfo[1] : 'Unknown Browser';
    const osInfo = userAgent.match(/\(([^)]+)\)/);
    const os = osInfo ? osInfo[1] : 'Unknown OS';
    return `${browser} on ${os}`;
  };

  // Function to estimate location (in production, you would use a geolocation service)
  const estimateLocation = async () => {
    try {
      // In a real app, you would use a geolocation API
      // This is just a placeholder
      return "Location inconnue";
    } catch (error) {
      console.error("Error getting location:", error);
      return "Location inconnue";
    }
  };

  useEffect(() => {
    // Get session on initial load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);

        // Record session for the user
        if (authOperations.recordNewSession) {
          const deviceInfo = getDeviceInfo();
          const location = await estimateLocation();
          const { sessionId } = await authOperations.recordNewSession(
            session.user.id,
            deviceInfo,
            location
          );
          if (sessionId) {
            setCurrentSessionId(sessionId);
          }
        }

        // Record login activity
        if (authOperations.recordAuthActivity) {
          const deviceInfo = getDeviceInfo();
          await authOperations.recordAuthActivity(
            session.user.id,
            'login',
            'User logged in',
            undefined,
            deviceInfo
          );
        }

        // Load active sessions and auth activities
        getActiveSessions();
        getAuthActivity(10);
      } else {
        // User logged out
        setActiveSessions([]);
        setAuthActivities([]);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);

        // For login events, record a new session
        if (_event === 'SIGNED_IN' && authOperations.recordNewSession) {
          const deviceInfo = getDeviceInfo();
          const location = await estimateLocation();
          const { sessionId } = await authOperations.recordNewSession(
            session.user.id,
            deviceInfo,
            location
          );
          if (sessionId) {
            setCurrentSessionId(sessionId);
          }

          // Record login activity
          if (authOperations.recordAuthActivity) {
            await authOperations.recordAuthActivity(
              session.user.id,
              'login',
              'User logged in',
              undefined,
              deviceInfo
            );
          }

          // Load active sessions and auth activities
          getActiveSessions();
          getAuthActivity(10);
        } else if (_event === 'SIGNED_OUT') {
          // Record logout activity if we still have the user ID
          if (currentSessionId && authOperations.terminateSession) {
            await authOperations.terminateSession(currentSessionId);
          }
          
          setActiveSessions([]);
          setAuthActivities([]);
          setCurrentSessionId(null);
        }
      } else {
        // User logged out or session expired
        setLoading(false);
      }
    });

    // Clean up subscription
    return () => subscription.unsubscribe();
  }, []);

  // Periodic session activity update (heartbeat)
  useEffect(() => {
    let heartbeatInterval: number;
    
    if (user && currentSessionId && authOperations.updateSessionActivity) {
      // Update session activity every 5 minutes
      heartbeatInterval = window.setInterval(() => {
        authOperations.updateSessionActivity(currentSessionId);
      }, 5 * 60 * 1000);
    }
    
    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, [user, currentSessionId, authOperations.updateSessionActivity]);

  // Redirect to profile page after successful login
  useEffect(() => {
    if (user && !loading && profile && !userLoading) {
      // Successfully logged in and profile loaded
      toast({
        title: "Byenveni, " + (profile.full_name || ""),
        description: "Ou konekte nan kont ou.",
      });
      
      // We can add navigation here if needed in the future
    }
  }, [user, loading, profile, userLoading]);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile,
      bankAccounts,
      loading,
      userLoading,
      ...authOperations,
      refreshProfile,
      getActiveSessions,
      getAuthActivity,
      terminateSession,
      terminateAllSessions,
      activeSessions,
      authActivities
    }}>
      {children}
    </AuthContext.Provider>
  );
}
