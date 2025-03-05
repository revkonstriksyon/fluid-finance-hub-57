import { useToast } from '@/components/ui/use-toast';
import { supabase, signInWithPhone, verifyOTP, signInWithGoogle } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useState } from 'react';
import { ActiveSession } from '@/types/auth';

export const useAuthOperations = () => {
  const { toast } = useToast();
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);

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
      return { 
        error: null, 
        user: data?.user || null, 
        session: data?.session || null 
      };
    } catch (error: any) {
      toast({
        title: "Erè verifikasyon",
        description: error.message || "Kòd OTP ou antre a pa valid. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { 
        error, 
        user: null,
        session: null
      };
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

  // Add the missing methods
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // First verify the current password is correct
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Pa gen itilizatè ki konekte");
      
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: userData.user.email || '',
        password: currentPassword
      });
      
      if (verifyError) throw new Error("Modpas aktyèl pa kòrèk");
      
      // Update to the new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Modpas chanje",
        description: "Modpas ou te chanje avèk siksè.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erè chanjman modpas",
        description: error.message || "Pa kapab chanje modpas. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const enable2FA = async (type: '2fa_sms' | '2fa_totp') => {
    try {
      if (type === '2fa_sms') {
        // Implementation for SMS-based 2FA would go here
        // This would typically involve sending an SMS to the user's phone
        toast({
          title: "2FA SMS Aktive",
          description: "Nou pral voye yon kòd verifikasyon nan telefòn ou pwochen fwa ou konekte.",
        });
      } else if (type === '2fa_totp') {
        // Implementation for TOTP-based 2FA would go here
        // This would typically involve generating a TOTP secret and QR code
        toast({
          title: "2FA TOTP Aktive",
          description: "Eskane kòd QR a ak aplikasyon otantifikatè ou a.",
        });
      }
      
      return { error: null, success: true };
    } catch (error: any) {
      toast({
        title: "Erè aktivasyon 2FA",
        description: error.message || "Pa kapab aktive 2FA. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error, success: false };
    }
  };

  const verify2FA = async (code: string, type: '2fa_sms' | '2fa_totp') => {
    try {
      // Verification logic would depend on the type of 2FA
      let success = false;
      
      if (type === '2fa_sms') {
        // Verify SMS code logic
        success = true; // Placeholder, actual implementation would verify the code
      } else if (type === '2fa_totp') {
        // Verify TOTP code logic
        success = true; // Placeholder, actual implementation would verify the code
      }
      
      if (success) {
        toast({
          title: "Verifikasyon reyisi",
          description: "Kòd 2FA verifye avèk siksè.",
        });
        return { error: null, success: true };
      } else {
        throw new Error("Kòd verifikasyon pa valid");
      }
    } catch (error: any) {
      toast({
        title: "Erè verifikasyon",
        description: error.message || "Pa kapab verifye kòd 2FA. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error, success: false };
    }
  };

  const fetchActiveSessions = async () => {
    try {
      // In a real implementation, you would fetch this from your backend
      // This is a placeholder implementation
      const mockSessions: ActiveSession[] = [
        {
          id: '1',
          device_name: 'iPhone 12',
          location: 'Port-au-Prince',
          last_active: new Date().toISOString(),
          ip_address: '192.168.1.1',
          current: true
        },
        {
          id: '2',
          device_name: 'MacBook Pro',
          location: 'Port-au-Prince',
          last_active: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          ip_address: '192.168.1.2',
          current: false
        },
        {
          id: '3',
          device_name: 'Windows PC',
          location: 'Jacmel',
          last_active: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          ip_address: '192.168.1.3',
          current: false
        }
      ];
      
      setActiveSessions(mockSessions);
      return mockSessions;
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      return [];
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      // In a real implementation, you would call your backend to terminate the session
      // This is a placeholder implementation
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      
      toast({
        title: "Sesyon fèmen",
        description: "Sesyon te fèmen avèk siksè.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erè fèmen sesyon",
        description: error.message || "Pa kapab fèmen sesyon. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const terminateAllSessions = async () => {
    try {
      // In a real implementation, you would call your backend to terminate all sessions except current
      // This is a placeholder implementation
      setActiveSessions(prev => prev.filter(session => session.current));
      
      toast({
        title: "Tout sesyon fèmen",
        description: "Tout lòt sesyon te fèmen avèk siksè.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erè fèmen sesyon",
        description: error.message || "Pa kapab fèmen sesyon. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error };
    }
  };

  // Initialize active sessions when the hook is first used
  useState(() => {
    fetchActiveSessions();
  });

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithPhoneNumber,
    verifyPhoneOTP,
    signInWithGoogleAccount,
    updatePassword,
    enable2FA,
    verify2FA,
    activeSessions,
    terminateSession,
    terminateAllSessions
  };
};
