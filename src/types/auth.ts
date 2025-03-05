import { Session, User } from '@supabase/supabase-js';

// Define types for user profile and bank account
export interface Profile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  joined_date: string;
  two_factor_enabled?: boolean;
  last_login?: string;
}

export interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
}

export interface AuthActivity {
  id: string;
  user_id: string;
  activity_type: string;
  details: string;
  ip_address?: string;
  device_info?: string;
  created_at: string;
}

export interface ActiveSession {
  id: string;
  user_id: string;
  device_name: string;
  location: string;
  last_active: string;
  is_current: boolean;
}

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  bankAccounts: BankAccount[];
  loading: boolean;
  userLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: any | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ user: User | null; session: Session | null; error: any | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithPhoneNumber: (phone: string) => Promise<{ error: any | null }>;
  verifyPhoneOTP: (phone: string, token: string) => Promise<{ error: any | null, user: User | null, session: Session | null }>;
  signInWithGoogleAccount: () => Promise<{ error: any | null }>;
  refreshProfile: () => Promise<void>;
  // Security and authentication related properties
  setup2FA?: (userId: string) => Promise<{ enabled: boolean, error: any | null }>;
  disable2FA?: (userId: string) => Promise<{ disabled: boolean, error: any | null }>;
  verify2FA?: (token: string, userId: string) => Promise<{ verified: boolean, error: any | null }>;
  is2FAEnabled?: boolean;
  is2FAVerified?: boolean;
  // Session management
  getActiveSessions?: (userId?: string) => Promise<{ sessions: ActiveSession[], error: any | null }>;
  terminateSession?: (sessionId: string) => Promise<{ success: boolean, error: any | null }>;
  terminateAllSessions?: () => Promise<{ success: boolean, error: any | null }>;
  // Auth activity
  getAuthActivity?: (userId?: string, limit?: string) => Promise<{ activities: AuthActivity[], error: any | null }>;
  recordAuthActivity?: (userId: string, activityType: string, details: string, ipAddress?: string, deviceInfo?: string) => Promise<{ success: boolean, error: any | null }>;
  // Data storage for sessions and activities
  activeSessions?: ActiveSession[];
  authActivities?: AuthActivity[];
};
