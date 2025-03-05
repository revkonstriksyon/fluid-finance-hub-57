
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
        console.error('Error fetching profile:', profileError);
        return;
      }

      setProfile(profileData as Profile);

      // Fetch bank accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', userId);

      if (accountsError) {
        console.error('Error fetching bank accounts:', accountsError);
        return;
      }

      setBankAccounts(accountsData as BankAccount[]);
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
