
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/auth';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    // Get session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
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
      } else {
        // User logged out
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
