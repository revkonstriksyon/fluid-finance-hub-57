
import { useToast } from '@/components/ui/use-toast';
import { supabase, signInWithPhone, verifyOTP, signInWithGoogle, signInWithFacebook } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export const useAuthOperations = () => {
  const { toast } = useToast();

  // Remove useNavigate from here as it causes issues when used outside Router

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast({
        title: "Koneksyon reyisi",
        description: "Ou konekte nan kont ou.",
      });
      
      // Let the component handle navigation
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erè koneksyon",
        description: error.message || "Tanpri tcheke imel ou ak modpas epi eseye ankò.",
        variant: "destructive"
      });
      return { error };
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

      toast({
        title: "Kont kreye",
        description: "Tcheke imel ou pou konfime kont ou.",
      });
      
      return { error: null, user: data?.user || null };
    } catch (error: any) {
      toast({
        title: "Erè enskripsyon",
        description: error.message || "Pa kapab kreye kont ou. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error, user: null };
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
      
      // Let the component handle navigation
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erè dekoneksyon",
        description: error.message || "Pa kapab dekonekte. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Imel reyinisyalizasyon modpas voye",
        description: "Tcheke imel ou pou enstriksyon sou reyinisyalizasyon modpas.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erè reyinisyalizasyon modpas",
        description: error.message || "Pa kapab voye imel reyinisyalizasyon. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error };
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
      
      toast({
        title: "Verifikasyon reyisi",
        description: "Ou konekte ak kont ou.",
      });
      
      // Let the component handle navigation
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

  const signInWithFacebookAccount = async () => {
    try {
      const { error } = await signInWithFacebook();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erè koneksyon Facebook",
        description: error.message || "Pa kapab konekte ak Facebook. Tanpri eseye ankò.",
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
    signInWithGoogleAccount,
    signInWithFacebookAccount
  };
};
