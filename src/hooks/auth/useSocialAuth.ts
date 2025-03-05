
import { signInWithGoogle } from '@/lib/supabase';
import { useAuthBase } from './useAuthBase';

export const useSocialAuth = () => {
  const { toast } = useAuthBase();

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
    signInWithGoogleAccount
  };
};
