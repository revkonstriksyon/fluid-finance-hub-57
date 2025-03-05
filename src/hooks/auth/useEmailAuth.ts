
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthBase } from './useAuthBase';

export const useEmailAuth = () => {
  const { toast, handleProfileCreation } = useAuthBase();

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with email:", email);
      
      // Input validation
      if (!email || !password) {
        console.error("Login error: Email and password are required");
        throw new Error("Imèl ak modpas yo obligatwa");
      }
      
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }
      
      console.log("Sign in successful, user data:", data.user?.id);
      
      // Verify we have valid user data
      if (!data.user) {
        console.error("Sign in response missing user data");
        throw new Error("Pa kapab konekte - pa gen done itilizatè");
      }
      
      // Load user profile data immediately after successful login
      await handleProfileCreation(data.user.id, data.user.user_metadata);
      
      toast({
        title: "Koneksyon reyisi",
        description: "Ou konekte nan kont ou.",
      });
      
      return { user: data.user, session: data.session, error: null };
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Provide more user-friendly error messages
      const errorMessage = translateErrorMessage(error);
      
      toast({
        title: "Erè koneksyon",
        description: errorMessage,
        variant: "destructive"
      });
      
      return { user: null, session: null, error: error };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      if (!email || !password || !name) {
        throw new Error("Tout chan yo obligatwa");
      }
      
      const { error, data } = await supabase.auth.signUp({
        email: email.trim(),
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
      console.error("Sign up error:", error);
      
      toast({
        title: "Erè enskripsyon",
        description: translateErrorMessage(error),
        variant: "destructive"
      });
      
      return { user: null, session: null, error: error };
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      if (!email) {
        throw new Error("Imèl obligatwa");
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
      
      toast({
        title: "Imel reyinisyalizasyon modpas voye",
        description: "Tcheke imel ou pou enstriksyon sou reyinisyalizasyon modpas.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      toast({
        title: "Erè reyinisyalizasyon modpas",
        description: translateErrorMessage(error),
        variant: "destructive"
      });
      
      throw error; // Re-throw the error to be handled by the caller
    }
  };
  
  // Helper function to translate common error messages
  const translateErrorMessage = (error: any): string => {
    const errorMessage = error?.message || error?.toString() || "Erè enkoni";
    
    // Map common errors to user-friendly messages in Haitian Creole
    if (errorMessage.includes("Invalid login credentials")) {
      return "Modpas oswa imèl pa kòrèk. Tanpri eseye ankò.";
    }
    if (errorMessage.includes("Email not confirmed")) {
      return "Imèl la pa konfime. Tanpri tcheke imel ou epi klike sou lyen konfimasyon an.";
    }
    if (errorMessage.includes("Password should be at least 6 characters")) {
      return "Modpas la dwe gen omwen 6 karaktè.";
    }
    if (errorMessage.includes("User already registered")) {
      return "Imèl sa a deja anrejistre. Tanpri eseye konekte olye de sa.";
    }
    
    // Return original message if no specific translation
    return errorMessage;
  };

  return {
    signIn,
    signUp,
    resetPassword
  };
};
