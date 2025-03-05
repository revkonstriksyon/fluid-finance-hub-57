
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
  last_login_date?: string;
  two_factor_enabled?: boolean;
  biometric_enabled?: boolean;
}

export interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  balance: number;
  currency: string;
  last_transaction_date?: string;
  requires_verification?: boolean;
}

export interface ActiveSession {
  id: string;
  device_name: string;
  location: string;
  last_active: string;
  ip_address: string;
  current: boolean;
}

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  bankAccounts: BankAccount[];
  activeSessions: ActiveSession[];
  loading: boolean;
  userLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithPhoneNumber: (phone: string) => Promise<{ error: any | null }>;
  verifyPhoneOTP: (phone: string, token: string) => Promise<{ error: any | null, user: User | null, session: Session | null }>;
  signInWithGoogleAccount: () => Promise<{ error: any | null }>;
  refreshProfile: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ error: any | null }>;
  enable2FA: (type: '2fa_sms' | '2fa_totp') => Promise<{ error: any | null, success: boolean }>;
  verify2FA: (code: string, type: '2fa_sms' | '2fa_totp') => Promise<{ error: any | null, success: boolean }>;
  terminateSession: (sessionId: string) => Promise<{ error: any | null }>;
  terminateAllSessions: () => Promise<{ error: any | null }>;
};
