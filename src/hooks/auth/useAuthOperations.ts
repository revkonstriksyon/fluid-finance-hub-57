
import { useEmailAuth } from './useEmailAuth';
import { usePhoneAuth } from './usePhoneAuth';
import { useSocialAuth } from './useSocialAuth';
import { useSession } from './useSession';
import { useTwoFactorAuth } from './useTwoFactorAuth';
import { useSessionManagement } from './useSessionManagement';
import { useAuthActivity } from './useAuthActivity';

export const useAuthOperations = () => {
  const emailAuth = useEmailAuth();
  const phoneAuth = usePhoneAuth();
  const socialAuth = useSocialAuth();
  const sessionAuth = useSession();
  const twoFactorAuth = useTwoFactorAuth();
  const sessionManagement = useSessionManagement();
  const authActivity = useAuthActivity();

  return {
    ...emailAuth,
    ...phoneAuth,
    ...socialAuth,
    ...sessionAuth,
    ...twoFactorAuth,
    ...sessionManagement,
    ...authActivity
  };
};
