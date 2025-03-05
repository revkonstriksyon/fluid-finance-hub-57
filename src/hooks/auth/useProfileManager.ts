
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useProfileData } from '@/hooks/useProfileData';
import { useToast } from '@/components/ui/use-toast';

export const useProfileManager = (user: User | null) => {
  const {
    profile,
    bankAccounts,
    userLoading,
    fetchUserProfile,
    refreshProfile: refreshUserProfile
  } = useProfileData();
  
  const { toast } = useToast();

  // Wrapper for refresh profile to use with the current user
  const refreshProfile = async () => {
    if (user) {
      await refreshUserProfile(user.id);
      toast({
        title: "Done yo aktyalize",
        description: "Done pwofil ou yo te aktyalize avèk siksè.",
      });
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
