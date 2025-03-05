
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export const useAuthBase = () => {
  const { toast } = useToast();

  const handleProfileCreation = async (userId: string, userMetadata: any) => {
    try {
      // Check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create one
        console.log("Creating new profile for user:", userId);
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            full_name: userMetadata?.full_name || 'New User',
            username: userMetadata?.email ? userMetadata.email.split('@')[0] : userMetadata?.phone || 'user',
            joined_date: new Date().toISOString()
          }]);
          
        if (createError) {
          console.error('Error creating profile:', createError);
          return { error: createError };
        }
      } else if (profileError) {
        console.error('Error checking profile:', profileError);
        return { error: profileError };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error in handleProfileCreation:', error);
      return { error };
    }
  };

  return {
    toast,
    handleProfileCreation
  };
};
