
import { supabase } from '@/lib/supabase';
import { AuthActivity } from '@/types/auth';

export const useAuthActivity = () => {
  const getAuthActivity = async (userId: string, limit: number = 10): Promise<{ activities: AuthActivity[], error: any | null }> => {
    try {
      const { data, error } = await supabase
        .from('auth_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { activities: data || [], error: null };
    } catch (error: any) {
      console.error("Erreur lors de la récupération des activités:", error);
      return { activities: [], error };
    }
  };

  const recordAuthActivity = async (
    userId: string, 
    activityType: string, 
    details: string,
    ipAddress?: string,
    deviceInfo?: string
  ): Promise<{ success: boolean, error: any | null }> => {
    try {
      const { error } = await supabase
        .from('auth_activity')
        .insert({
          user_id: userId,
          activity_type: activityType,
          details,
          ip_address: ipAddress,
          device_info: deviceInfo,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de l'activité:", error);
      return { success: false, error };
    }
  };

  return {
    getAuthActivity,
    recordAuthActivity
  };
};
