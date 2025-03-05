
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, signInWithPhone, verifyOTP, signInWithGoogle } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

// Define types for user profile and bank account
interface Profile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  joined_date: string;
}

interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  balance: number;
  currency: string;
}

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  bankAccounts: BankAccount[];
  loading: boolean;
  userLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithPhoneNumber: (phone: string) => Promise<{ error: any | null }>;
  verifyPhoneOTP: (phone: string, token: string) => Promise<{ error: any | null, user: User | null }>;
  signInWithGoogleAccount: () => Promise<{ error: any | null }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      setUserLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      setProfile(profileData as Profile);

      // Fetch bank accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', userId);

      if (accountsError) {
        console.error('Error fetching bank accounts:', accountsError);
        return;
      }

      setBankAccounts(accountsData as BankAccount[]);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setUserLoading(false);
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    // Get session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserLoading(false);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setBankAccounts([]);
        setUserLoading(false);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Koneksyon reyisi",
        description: "Ou konekte nan kont ou.",
      });
    } catch (error: any) {
      toast({
        title: "Erè koneksyon",
        description: error.message || "Tanpri tcheke imel ou ak modpas epi eseye ankò.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) throw error;

      // If the user is created, we need to update their profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: name,
              username: email.split('@')[0],
              avatar_url: '',
              phone: '',
            },
          ]);

        if (profileError) throw profileError;
      }

      toast({
        title: "Kont kreye",
        description: "Tcheke imel ou pou konfime kont ou.",
      });
    } catch (error: any) {
      toast({
        title: "Erè enskripsyon",
        description: error.message || "Pa kapab kreye kont ou. Tanpri eseye ankò.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Dekonekte",
        description: "Ou dekonekte soti nan kont ou.",
      });
    } catch (error: any) {
      toast({
        title: "Erè dekoneksyon",
        description: error.message || "Pa kapab dekonekte. Tanpri eseye ankò.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast({
        title: "Imel reyinisyalizasyon modpas voye",
        description: "Tcheke imel ou pou enstriksyon sou reyinisyalizasyon modpas.",
      });
    } catch (error: any) {
      toast({
        title: "Erè reyinisyalizasyon modpas",
        description: error.message || "Pa kapab voye imel reyinisyalizasyon. Tanpri eseye ankò.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signInWithPhoneNumber = async (phone: string) => {
    try {
      const { error } = await signInWithPhone(phone);
      if (error) throw error;
      toast({
        title: "Kòd OTP voye",
        description: "Tanpri verifye telefòn ou pou kòd OTP a.",
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erè koneksyon",
        description: error.message || "Pa kapab voye kòd OTP. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const verifyPhoneOTP = async (phone: string, token: string) => {
    try {
      const { data, error } = await verifyOTP(phone, token);
      if (error) throw error;
      
      // If this is a new user, make sure a profile is created
      if (data?.user) {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();
          
        if (!existingProfile) {
          // Profile doesn't exist yet, create one
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                phone: phone,
                full_name: data.user.user_metadata?.full_name || 'New User',
                username: phone.replace(/\D/g, ''),
                updated_at: new Date().toISOString(),
              },
            ]);

          if (profileError) throw profileError;
        }
      }
      
      toast({
        title: "Verifikasyon reyisi",
        description: "Ou konekte ak kont ou.",
      });
      return { error: null, user: data?.user || null };
    } catch (error: any) {
      toast({
        title: "Erè verifikasyon",
        description: error.message || "Kòd OTP ou antre a pa valid. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error, user: null };
    }
  };

  const signInWithGoogleAccount = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erè koneksyon Google",
        description: error.message || "Pa kapab konekte ak Google. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile,
      bankAccounts,
      loading, 
      userLoading,
      signIn, 
      signUp, 
      signOut, 
      resetPassword,
      signInWithPhoneNumber,
      verifyPhoneOTP,
      signInWithGoogleAccount,
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
