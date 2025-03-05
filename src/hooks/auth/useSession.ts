
import { supabase } from '@/lib/supabase';
import { useAuthBase } from './useAuthBase';

export const useSession = () => {
  const { toast } = useAuthBase();

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

  return {
    signOut
  };
};
