import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile, BankAccount } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

export const useProfileData = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      setUserLoading(true);
      
      // Get profile data - with RLS this will only return the user's own profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        // If profile doesn't exist, create a new one
        if (profileError.code === 'PGRST116') {
          console.log('Creating new profile for user', userId);
          
          const { data: userData } = await supabase.auth.getUser();
          if (userData && userData.user) {
            const newProfile = {
              id: userId,
              full_name: userData.user.user_metadata?.full_name || '',
              username: userData.user.email ? userData.user.email.split('@')[0] : '',
              avatar_url: null,
              phone: userData.user.phone || null,
              location: null,
              bio: null,
              joined_date: new Date().toISOString()
            };
            
            const { data: newProfileData, error: createError } = await supabase
              .from('profiles')
              .insert([newProfile])
              .select()
              .single();
              
            if (createError) {
              console.error('Error creating profile:', createError);
              toast({
                title: "Erè",
                description: "Pa kapab kreye pwofil ou. Tanpri eseye ankò.",
                variant: "destructive"
              });
            } else {
              setProfile(newProfileData as Profile);
            }
          }
        } else {
          console.error('Error fetching profile:', profileError);
          toast({
            title: "Erè",
            description: "Pa kapab jwenn pwofil ou. Tanpri eseye ankò.",
            variant: "destructive"
          });
        }
      } else {
        setProfile(profileData as Profile);
      }

      // Fetch bank accounts - with RLS this will only return the user's own accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', userId);

      if (accountsError) {
        console.error('Error fetching bank accounts:', accountsError);
        toast({
          title: "Erè",
          description: "Pa kapab jwenn kont bank ou. Tanpri eseye ankò.",
          variant: "destructive"
        });
      } else {
        setBankAccounts(accountsData as BankAccount[]);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      toast({
        title: "Erè",
        description: "Yon erè pase pandan nou t ap jwenn done ou yo.",
        variant: "destructive"
      });
    } finally {
      setUserLoading(false);
    }
  };

  // Refresh profile data
  const refreshProfile = async (userId: string | undefined) => {
    if (userId) {
      await fetchUserProfile(userId);
    }
  };

  return {
    profile,
    setProfile,
    bankAccounts,
    setBankAccounts,
    userLoading,
    setUserLoading,
    fetchUserProfile,
    refreshProfile
  };
};
