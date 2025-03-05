
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile, BankAccount } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

export const useProfileData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    setUserLoading(true);
    try {
      console.log("Fetching user profile for:", userId);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }
      
      if (!profileData) {
        console.log("Profile not found, creating one");
        
        // Profile doesn't exist, create one
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        const user = userData?.user;
        if (!user) throw new Error("User not found");
        
        const { error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New User',
            username: user.email?.split('@')[0] || '',
            joined_date: new Date().toISOString()
          }]);
        
        if (createError) throw createError;
        
        // Fetch the newly created profile
        const { data: newProfileData, error: newProfileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (newProfileError) throw newProfileError;
        
        setProfile(newProfileData as Profile);
      } else {
        setProfile(profileData as Profile);
      }
      
      // Fetch bank accounts
      const { data: bankData, error: bankError } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', userId);
      
      if (bankError) {
        console.error("Error fetching bank accounts:", bankError);
      } else {
        console.log("Fetched bank accounts:", bankData?.length || 0);
        setBankAccounts(bankData as BankAccount[]);
      }
      
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Erè",
        description: error.message || "Pa kapab chaje pwofil ou.",
        variant: "destructive",
      });
    } finally {
      setUserLoading(false);
    }
  };
  
  const refreshProfile = async (userId: string) => {
    try {
      console.log("Refreshing profile for user:", userId);
      setUserLoading(true);
      await fetchUserProfile(userId);
    } catch (error) {
      console.error("Error refreshing profile:", error);
    } finally {
      setUserLoading(false);
    }
  };
  
  return {
    profile,
    bankAccounts,
    userLoading,
    fetchUserProfile,
    refreshProfile
  };
};
