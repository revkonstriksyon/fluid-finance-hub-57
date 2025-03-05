
import { supabase, signInWithPhone, verifyOTP } from '@/lib/supabase';
import { useAuthBase } from './useAuthBase';

export const usePhoneAuth = () => {
  const { toast, handleProfileCreation } = useAuthBase();

  const signInWithPhoneNumber = async (phone: string) => {
    try {
      console.log("Attempting to sign in with phone:", phone);
      
      const { error } = await signInWithPhone(phone);
      if (error) throw error;
      
      console.log("OTP sent successfully to:", phone);
      
      toast({
        title: "Kòd OTP voye",
        description: "Tanpri verifye telefòn ou pou kòd OTP a.",
      });
      return { error: null };
    } catch (error: any) {
      console.error("Phone signin error:", error);
      
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
      console.log("Verifying OTP for phone:", phone);
      
      const { data, error } = await verifyOTP(phone, token);
      if (error) throw error;
      
      console.log("OTP verification successful, data:", data);
      
      // If this is a new user, make sure a profile is created
      if (data?.user) {
        console.log("Creating/updating profile for user:", data.user.id);
        
        const randomUsername = 'user' + Math.floor(Math.random() * 10000);
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([{
            id: data.user.id,
            phone: phone,
            full_name: data.user.user_metadata?.full_name || 'New User',
            username: phone.replace(/\D/g, '') || randomUsername,
            joined_date: new Date().toISOString()
          }], { onConflict: 'id' });
        
        if (profileError) {
          console.error("Error creating/updating profile:", profileError);
          throw profileError;
        }
        
        console.log("Profile created/updated successfully");
      } else {
        console.warn("User object is null after OTP verification");
      }
      
      toast({
        title: "Verifikasyon reyisi",
        description: "Ou konekte ak kont ou.",
      });
      
      return { error: null, user: data?.user || null, session: data?.session || null };
    } catch (error: any) {
      console.error("OTP verification error:", error);
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
