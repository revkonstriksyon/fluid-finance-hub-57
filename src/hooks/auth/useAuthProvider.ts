
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { useToast } from '@/components/ui/use-toast';
import { ActiveSession, AuthActivity } from '@/types/auth';
import { useSessionInitialization } from '@/hooks/auth/useSessionInitialization';
import { useAuthStateChange } from '@/hooks/auth/useAuthStateChange';
import { useSessionHeartbeat } from '@/hooks/auth/useSessionHeartbeat';

export const useAuthProvider = () => {
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
  const getAuthActivity = async (userId?: string, limit?: string | number) => {
    if (user && authOperations.getAuthActivity) {
      // If limit is a number, convert it to string
      const limitStr = limit !== undefined ? limit.toString() : undefined;
      const { activities, error } = await authOperations.getAuthActivity(
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

  // Use our custom hooks
  const { initializeUserSession } = useSessionInitialization(
    fetchUserProfile, 
    authOperations.recordAuthActivity,
    authOperations.recordNewSession,
    getActiveSessions,
    getAuthActivity
  );

  const { handleAuthChange } = useAuthStateChange(
    fetchUserProfile,
    authOperations.recordAuthActivity,
    authOperations.recordNewSession,
    authOperations.terminateSession,
    getActiveSessions,
    getAuthActivity
  );

  // Monitor session activity with a heartbeat
  useSessionHeartbeat(user, currentSessionId, authOperations.updateSessionActivity);

  useEffect(() => {
    console.log("AuthProvider initialized, checking session...");
    let isMounted = true;
    
    // Get session on initial load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session found" : "No session");
      
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log("User found in session, fetching profile:", session.user.id);
        try {
          // Make sure to call fetchUserProfile directly so we know it's completed
          await fetchUserProfile(session.user.id);
          
          const sessionId = await initializeUserSession(session.user);
          if (sessionId) {
            setCurrentSessionId(sessionId);
          }
        } catch (error) {
          console.error("Error initializing session:", error);
        }
      } else {
        // User logged out
        setActiveSessions([]);
        setAuthActivities([]);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (!isMounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log("Auth state changed: SIGNED_IN, user:", session.user.id, "currentSessionId:", currentSessionId);
        try {
          // Ensure profile is loaded first
          await fetchUserProfile(session.user.id);
          
          const sessionId = await handleAuthChange(event, session.user, currentSessionId);
          if (sessionId) {
            setCurrentSessionId(sessionId);
          }
        } catch (error) {
          console.error("Error handling auth change:", error);
        } finally {
          // Make sure loading is false even if there was an error
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setActiveSessions([]);
        setAuthActivities([]);
        setCurrentSessionId(null);
        setLoading(false);
      }
    });

    // Redirect to profile page after successful login
    if (user && !loading && profile && !userLoading) {
      // Successfully logged in and profile loaded
      toast({
        title: "Byenveni, " + (profile.full_name || ""),
        description: "Ou konekte nan kont ou.",
      });
    }

    // Clean up subscription
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [user, loading, profile, userLoading]);

  return { 
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
  };
};
