
import { signInWithGoogle, signInWithFacebook, signInWithApple } from '@/lib/supabase';
import { useAuthBase } from './useAuthBase';

export const useSocialAuth = () => {
  const { toast } = useAuthBase();

  const signInWithGoogleAccount = async () => {
    try {
      console.log("Attempting Google sign in");
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        console.error("Google sign in error:", error);
        toast({
          title: "Erè koneksyon Google",
          description: error.message || "Pa kapab konekte ak Google. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { error };
      }
      
      console.log("Google auth initiated successfully", data);
      return { error: null };
    } catch (error: any) {
      console.error("Exception during Google sign in:", error);
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
      console.log("Attempting Facebook sign in");
      const { data, error } = await signInWithFacebook();
      
      if (error) {
        console.error("Facebook sign in error:", error);
        toast({
          title: "Erè koneksyon Facebook",
          description: error.message || "Pa kapab konekte ak Facebook. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { error };
      }
      
      console.log("Facebook auth initiated successfully", data);
      return { error: null };
    } catch (error: any) {
      console.error("Exception during Facebook sign in:", error);
      toast({
        title: "Erè koneksyon Facebook",
        description: error.message || "Pa kapab konekte ak Facebook. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signInWithAppleAccount = async () => {
    try {
      console.log("Attempting Apple sign in");
      const { data, error } = await signInWithApple();
      
      if (error) {
        console.error("Apple sign in error:", error);
        toast({
          title: "Erè koneksyon Apple",
          description: error.message || "Pa kapab konekte ak Apple. Tanpri eseye ankò.",
          variant: "destructive"
        });
        return { error };
      }
      
      console.log("Apple auth initiated successfully", data);
      return { error: null };
    } catch (error: any) {
      console.error("Exception during Apple sign in:", error);
      toast({
        title: "Erè koneksyon Apple",
        description: error.message || "Pa kapab konekte ak Apple. Tanpri eseye ankò.",
        variant: "destructive"
      });
      return { error };
    }
  };

  return {
    signInWithGoogleAccount,
    signInWithFacebookAccount,
    signInWithAppleAccount
  };
};
