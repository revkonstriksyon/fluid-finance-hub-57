
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthBase } from './useAuthBase';

export const useEmailAuth = () => {
  const { toast, handleProfileCreation } = useAuthBase();

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with email:", email);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }
      
      console.log("Sign in successful, user data:", data);
      
      // Load user profile data immediately after successful login
      if (data.user) {
        await handleProfileCreation(data.user.id, data.user.user_metadata);
      }
      
      toast({
        title: "Koneksyon reyisi",
        description: "Ou konekte nan kont ou.",
      });
      
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Erè koneksyon",
        description: error.message || "Tanpri tcheke imel ou ak modpas epi eseye ankò.",
        variant: "destructive"
      });
      return { user: null, error: error };
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
          },
          emailRedirectTo: window.location.origin
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
        description: data.session ? "Ou kapab konekte kounye a." : "Tcheke imel ou pou konfime kont ou.",
      });
      
      return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
      toast({
        title: "Erè enskripsyon",
        description: error.message || "Pa kapab kreye kont ou. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { user: null, session: null, error: error };
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

  return {
    signIn,
    signUp,
    resetPassword
  };
};
