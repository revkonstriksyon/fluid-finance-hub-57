
import { useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { ActiveSession, AuthActivity, Profile } from '@/types/auth';

type AuthEffectsProps = {
  fetchUserProfile: (userId: string) => Promise<void>;
  initializeUserSession: (user: User) => Promise<string | null>;
  handleAuthChange: (event: string, user: User, currentSessionId: string | null) => Promise<string | null>;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setCurrentSessionId: (sessionId: string | null) => void;
  setActiveSessions: (sessions: ActiveSession[]) => void;
  setAuthActivities: (activities: AuthActivity[]) => void;
  user: User | null;
  loading: boolean;
  profile: Profile | null;
  userLoading: boolean;
  currentSessionId: string | null;
};

export function useAuthEffects({
  fetchUserProfile,
  initializeUserSession,
  handleAuthChange,
  setSession,
  setUser,
  setLoading,
  setCurrentSessionId,
  setActiveSessions,
  setAuthActivities,
  user,
  loading,
  profile,
  userLoading,
  currentSessionId
}: AuthEffectsProps) {
  const { toast } = useToast();

  // Initialize authentication on mount
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
          await fetchUserProfile(session.user.id);
          
          const sessionId = await handleAuthChange(event, session.user, currentSessionId);
          if (sessionId) {
            setCurrentSessionId(sessionId);
          }
        } catch (error) {
          console.error("Error handling auth change:", error);
        } finally {
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
  }, [currentSessionId]);

  // Show welcome toast when user logs in
  useEffect(() => {
    if (user && !loading && profile && !userLoading) {
      toast({
        title: "Byenveni, " + (profile.full_name || ""),
        description: "Ou konekte nan kont ou.",
      });
    }
  }, [user, loading, profile, userLoading, toast]);
}
