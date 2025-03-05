
import { Session, User } from '@supabase/supabase-js';
import { Profile } from './profile';

export interface ActiveSession {
  id: string;
  device_name: string;
  location: string;
  last_active: string;
  ip_address: string;
  current: boolean;
}

export interface BankAccount {
  id: string;
  account_number: string;
  bank_name: string;
  account_type: string;
  balance: number;
  currency: string;
  is_primary: boolean;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  bankAccounts: BankAccount[];
  activeSessions: ActiveSession[];
  loading: boolean;
  userLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ user: User | null; session: Session | null; error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithPhoneNumber: (phone: string) => Promise<{ error: any }>;
  verifyPhoneOTP: (phone: string, token: string) => Promise<{ error: any; user: User | null; session: Session | null }>;
  signInWithGoogleAccount: () => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<{ error: any }>;
  enable2FA: (type: '2fa_sms' | '2fa_totp') => Promise<{ error: any; success: boolean }>;
  verify2FA: (code: string, type: '2fa_sms' | '2fa_totp') => Promise<{ error: any; success: boolean }>;
  terminateSession: (sessionId: string) => Promise<{ error: any }>;
  terminateAllSessions: () => Promise<{ error: any }>;
}
