
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/auth';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuthOperations } from '@/hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
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
    if (user?.id) {
      await refreshUserProfile(user.id);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Combine the auth operations with our state
  const contextValue: AuthContextType = {
    session,
    user,
    profile,
    bankAccounts,
    activeSessions: authOperations.activeSessions,
    loading,
    userLoading,
    signIn: authOperations.signIn,
    signUp: authOperations.signUp,
    signOut: authOperations.signOut,
    resetPassword: authOperations.resetPassword,
    signInWithPhoneNumber: authOperations.signInWithPhoneNumber,
    verifyPhoneOTP: authOperations.verifyPhoneOTP,
    signInWithGoogleAccount: authOperations.signInWithGoogleAccount,
    refreshProfile,
    updatePassword: authOperations.updatePassword,
    enable2FA: authOperations.enable2FA,
    verify2FA: authOperations.verify2FA,
    terminateSession: authOperations.terminateSession,
    terminateAllSessions: authOperations.terminateAllSessions
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
