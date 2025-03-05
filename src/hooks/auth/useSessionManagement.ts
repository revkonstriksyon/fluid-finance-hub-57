
import { supabase } from '@/lib/supabase';
import { useAuthBase } from './useAuthBase';
import { ActiveSession } from '@/types/auth';

export const useSessionManagement = () => {
  const { toast } = useAuthBase();

  const getActiveSessions = async (userId?: string): Promise<{ sessions: ActiveSession[], error: any | null }> => {
    try {
      if (!userId) {
        return { sessions: [], error: new Error('User ID is required') };
      }
      
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('last_active', { ascending: false });

      if (error) throw error;

      return { sessions: data || [], error: null };
    } catch (error: any) {
      console.error("Erreur lors de la récupération des sessions:", error);
      return { sessions: [], error };
    }
  };

  const terminateSession = async (sessionId: string): Promise<{ success: boolean, error: any | null }> => {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Sesyon fèmen",
        description: "Sesyon fèmen avèk siksè.",
      });

      return { success: true, error: null };
    } catch (error: any) {
      toast({
        title: "Erè",
        description: error.message || "Pa kapab fèmen sesyon. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const terminateAllSessions = async (userId: string, currentSessionId: string): Promise<{ success: boolean, error: any | null }> => {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .delete()
        .eq('user_id', userId)
        .neq('id', currentSessionId); // Ne pas supprimer la session actuelle

      if (error) throw error;

      toast({
        title: "Tout sesyon fèmen",
        description: "Tout lòt sesyon fèmen avèk siksè.",
      });

      return { success: true, error: null };
    } catch (error: any) {
      toast({
        title: "Erè",
        description: error.message || "Pa kapab fèmen tout sesyon. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const recordNewSession = async (userId: string, deviceInfo: string, location: string): Promise<{ success: boolean, sessionId: string | null, error: any | null }> => {
    try {
      const { data, error } = await supabase
        .from('active_sessions')
        .insert({
          user_id: userId,
          device_name: deviceInfo,
          location: location,
          last_active: new Date().toISOString(),
          is_current: true
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, sessionId: data.id, error: null };
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de la session:", error);
      return { success: false, sessionId: null, error };
    }
  };

  const updateSessionActivity = async (sessionId: string): Promise<{ success: boolean, error: any | null }> => {
    try {
      const { error } = await supabase
        .from('active_sessions')
        .update({ last_active: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'activité de session:", error);
      return { success: false, error };
    }
  };

  return {
    getActiveSessions,
    terminateSession,
    terminateAllSessions,
    recordNewSession,
    updateSessionActivity
  };
};
