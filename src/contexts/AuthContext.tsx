
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
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

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, resetPassword }}>
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
