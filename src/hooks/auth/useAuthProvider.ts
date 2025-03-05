
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { useAuthEffects } from './useAuthEffects';
import { useProfileData } from '@/hooks/useProfileData';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { useSessionInitialization } from '@/hooks/auth/useSessionInitialization';
import { useAuthStateChange } from '@/hooks/auth/useAuthStateChange';
import { useSessionHeartbeat } from '@/hooks/auth/useSessionHeartbeat';

export const useAuthProvider = () => {
  // Get the auth state
  const {
    session,
    setSession,
    user,
    setUser,
    loading,
    setLoading,
    currentSessionId,
    setCurrentSessionId,
    activeSessions,
    setActiveSessions,
    authActivities,
    setAuthActivities
  } = useAuthState();
  
  // Get profile data
  const {
    profile,
    bankAccounts,
    userLoading,
    fetchUserProfile,
    refreshProfile: refreshUserProfile
  } = useProfileData();
  
  // Get auth operations
  const authOperations = useAuthOperations();
  
  // Custom hooks for session initialization and auth state changes
  const { initializeUserSession } = useSessionInitialization(
    fetchUserProfile, 
    authOperations.recordAuthActivity,
    authOperations.recordNewSession,
    authOperations.getActiveSessions,
    authOperations.getAuthActivity
  );

  const { handleAuthChange } = useAuthStateChange(
    fetchUserProfile,
    authOperations.recordAuthActivity,
    authOperations.recordNewSession,
    authOperations.terminateSession,
    authOperations.getActiveSessions,
    authOperations.getAuthActivity
  );
  
  // Get auth actions
  const {
    refreshProfile,
    getActiveSessions,
    getAuthActivity,
    terminateSession,
    terminateAllSessions
  } = useAuthActions({
    user,
    refreshUserProfile,
    getActiveSessions: authOperations.getActiveSessions,
    getAuthActivity: authOperations.getAuthActivity,
    terminateSession: authOperations.terminateSession,
    terminateAllSessions: authOperations.terminateAllSessions,
    recordAuthActivity: authOperations.recordAuthActivity,
    setActiveSessions,
    setAuthActivities,
    currentSessionId
  });
  
  // Setup auth effects
  useAuthEffects({
    fetchUserProfile,
    initializeUserSession,
    handleAuthChange,
    setSession,
    setUser,
    setLoading,
    setCurrentSessionId,
    setActiveSessions,
    setAuthActivities,
    user,
    loading,
    profile,
    userLoading,
    currentSessionId
  });
  
  // Monitor session activity with a heartbeat
  useSessionHeartbeat(user, currentSessionId, authOperations.updateSessionActivity);
  
  // Return the combined auth context
  return { 
    session, 
    user, 
    profile,
    bankAccounts,
    loading,
    userLoading,
    ...authOperations,
    refreshProfile,
    getActiveSessions,
    getAuthActivity,
    terminateSession,
    terminateAllSessions,
    activeSessions,
    authActivities
  };
};
