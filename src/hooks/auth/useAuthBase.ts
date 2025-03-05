
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export const useAuthBase = () => {
  const { toast } = useToast();

  const handleProfileCreation = async (userId: string, userMetadata: any) => {
    try {
      console.log("Handling profile creation for user:", userId);
      
      // Check if profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (profileError) {
        console.error('Error checking profile:', profileError);
        return { error: profileError };
      }
      
      if (!profileData) {
        // Profile doesn't exist, create one
        console.log("Creating new profile for user:", userId);
        
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            full_name: userMetadata?.full_name || 'New User',
            username: userMetadata?.email ? userMetadata.email.split('@')[0] : userMetadata?.phone || 'user' + Math.floor(Math.random() * 1000),
            joined_date: new Date().toISOString()
          }]);
          
        if (createError) {
          console.error('Error creating profile:', createError);
          return { error: createError };
        }
        
        console.log("Profile created successfully");
      } else {
        console.log("Profile already exists for user:", userId);
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
