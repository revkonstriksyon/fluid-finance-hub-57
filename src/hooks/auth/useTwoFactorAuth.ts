
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthBase } from './useAuthBase';

export const useTwoFactorAuth = () => {
  const { toast } = useAuthBase();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(false);

  const setup2FA = async (userId: string) => {
    try {
      // Vérifier si 2FA est déjà configuré pour cet utilisateur
      const { data, error } = await supabase
        .from('profiles')
        .select('two_factor_enabled')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Si 2FA est déjà activé, retourner l'état actuel
      if (data?.two_factor_enabled) {
        setIs2FAEnabled(true);
        return { enabled: true, error: null };
      }

      // Sinon, mettre à jour le profil pour activer 2FA
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ two_factor_enabled: true })
        .eq('id', userId);

      if (updateError) throw updateError;

      setIs2FAEnabled(true);
      toast({
        title: "2FA Aktive",
        description: "Otantifikasyon de-faktè aktive avèk siksè.",
      });

      return { enabled: true, error: null };
    } catch (error: any) {
      toast({
        title: "Erè aktivasyon 2FA",
        description: error.message || "Pa kapab aktive 2FA. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { enabled: false, error };
    }
  };

  const disable2FA = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ two_factor_enabled: false })
        .eq('id', userId);

      if (error) throw error;

      setIs2FAEnabled(false);
      toast({
        title: "2FA Dezaktive",
        description: "Otantifikasyon de-faktè dezaktive avèk siksè.",
      });

      return { disabled: true, error: null };
    } catch (error: any) {
      toast({
        title: "Erè dezaktivasyion 2FA",
        description: error.message || "Pa kapab dezaktive 2FA. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { disabled: false, error };
    }
  };

  const verify2FA = async (token: string, userId: string) => {
    try {
      // Ici, on simulerait la vérification d'un token 2FA
      // Pour un vrai système, il faudrait implémenter une logique de vérification

      // Simuler une vérification (en production, remplacer par une vraie vérification)
      const isValid = token.length === 6 && /^\d+$/.test(token);
      
      if (!isValid) {
        throw new Error("Kòd 2FA pa valid");
      }

      // Enregistrer la vérification réussie
      const { error } = await supabase
        .from('auth_activity')
        .insert({
          user_id: userId,
          activity_type: '2fa_verification',
          details: 'Vérification 2FA réussie',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setIs2FAVerified(true);
      toast({
        title: "Verifikasyon 2FA Reyisi",
        description: "Otantifikasyon de-faktè verifye avèk siksè.",
      });

      return { verified: true, error: null };
    } catch (error: any) {
      toast({
        title: "Erè verifikasyon 2FA",
        description: error.message || "Pa kapab verifye kòd 2FA. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { verified: false, error };
    }
  };

  const sendSecurityNotification = async (userId: string, activityType: string, details: string) => {
    try {
      const { error } = await supabase
        .from('auth_activity')
        .insert({
          user_id: userId,
          activity_type: activityType,
          details,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de notification:", error);
      return { success: false, error };
    }
  };

  return {
    is2FAEnabled,
    is2FAVerified,
    setup2FA,
    disable2FA,
    verify2FA,
    sendSecurityNotification
  };
};
