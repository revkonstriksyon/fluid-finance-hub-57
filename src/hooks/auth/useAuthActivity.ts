
import { supabase, recordAuthActivity as recordActivity, getAuthActivity as fetchActivities } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const useAuthActivity = () => {
  const { toast } = useToast();

  const recordAuthActivity = async (
    userId: string, 
    activityType: string, 
    details: string, 
    ipAddress?: string, 
    deviceInfo?: string
  ) => {
    try {
      const { data, error } = await recordActivity(userId, activityType, details, ipAddress, deviceInfo);
      if (error) throw error;
      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error recording auth activity:', error);
      return { success: false, error };
    }
  };

  const getAuthActivity = async (userId: string, limit?: string) => {
    try {
      const { data, error } = await fetchActivities(userId, limit ? parseInt(limit) : undefined);
      if (error) throw error;
      return { activities: data || [], error: null };
    } catch (error: any) {
      console.error('Error getting auth activities:', error);
      return { activities: [], error };
    }
  };

  return {
    recordAuthActivity,
    getAuthActivity
  };
};
