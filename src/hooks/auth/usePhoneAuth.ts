
import { User, Session } from '@supabase/supabase-js';
import { supabase, signInWithPhone, verifyOTP } from '@/lib/supabase';
import { useAuthBase } from './useAuthBase';

export const usePhoneAuth = () => {
  const { toast, handleProfileCreation } = useAuthBase();

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
        const { error: profileError } = await handleProfileCreation(data.user.id, {
          ...data.user.user_metadata,
          phone: phone
        });
        
        if (profileError) throw profileError;
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
      return { error, user: null, session: null };
    }
  };

  return {
    signInWithPhoneNumber,
    verifyPhoneOTP
  };
};
