
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

export const useWelcomeEffect = (
  user: User | null,
  loading: boolean,
  profile: any | null,
  userLoading: boolean
) => {
  const { toast } = useToast();

  useEffect(() => {
    // Redirect to profile page after successful login
    if (user && !loading && profile && !userLoading) {
      // Successfully logged in and profile loaded
      toast({
        title: "Byenveni, " + (profile.full_name || ""),
        description: "Ou konekte nan kont ou.",
      });
    }
  }, [user, loading, profile, userLoading, toast]);
};
