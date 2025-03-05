
import { useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { ActiveSession, AuthActivity } from '@/types/auth';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [authActivities, setAuthActivities] = useState<AuthActivity[]>([]);

  return {
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
  };
}
