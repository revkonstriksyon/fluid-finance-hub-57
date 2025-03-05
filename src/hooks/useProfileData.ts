
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile, BankAccount } from '@/types/auth';

export const useProfileData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      setUserLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        // If profile doesn't exist, create a new one
        if (profileError.code === 'PGRST116') {
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
            } else {
              setProfile(newProfileData as Profile);
            }
          }
        } else {
          console.error('Error fetching profile:', profileError);
        }
      } else {
        setProfile(profileData as Profile);
      }

      // Fetch bank accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', userId);

      if (accountsError) {
        console.error('Error fetching bank accounts:', accountsError);
      } else {
        setBankAccounts(accountsData as BankAccount[]);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
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
