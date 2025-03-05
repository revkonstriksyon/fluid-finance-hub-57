
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useAuthInitializer = (
  fetchUserProfile: (userId: string) => Promise<void>,
  initializeUserSession: (user: User) => Promise<string | null>,
  handleAuthChange: (event: string, user: User | null, currentSessionId: string | null) => Promise<string | null>,
  setCurrentSessionId: (sessionId: string | null) => void,
  setActiveSessions: (sessions: any[]) => void,
  setAuthActivities: (activities: any[]) => void
) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth and session
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
        console.log("Auth state changed: user logged in, user:", session.user.id);
        try {
          // Ensure profile is loaded first
          await fetchUserProfile(session.user.id);
          
          const sessionId = await handleAuthChange(event, session.user, null);
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

    // Clean up subscription
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    loading,
    setUser,
    setSession,
    setLoading
  };
};
