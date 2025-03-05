
import { useEmailAuth } from './useEmailAuth';
import { usePhoneAuth } from './usePhoneAuth';
import { useSocialAuth } from './useSocialAuth';
import { useSession } from './useSession';

export const useAuthOperations = () => {
  const emailAuth = useEmailAuth();
  const phoneAuth = usePhoneAuth();
  const socialAuth = useSocialAuth();
  const sessionAuth = useSession();

  return {
    ...emailAuth,
    ...phoneAuth,
    ...socialAuth,
    ...sessionAuth
  };
};
