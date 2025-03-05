
import { useToast } from '@/components/ui/use-toast';
import { supabase, signInWithPhone, verifyOTP, signInWithGoogle } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export const useAuthOperations = () => {
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }
      
      toast({
        title: "Koneksyon reyisi",
        description: "Ou konekte nan kont ou.",
      });
      
      return { user: data.user, error: null };
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
      return { error: null, user: data?.user || null, session: data?.session || null };
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

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithPhoneNumber,
    verifyPhoneOTP,
    signInWithGoogleAccount
  };
};
