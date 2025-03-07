
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  joined_date: string | null;
  updated_at: string | null;
}

export interface BankAccount {
  id: string;
  user_id: string;
  account_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  session: any | null;
  user: User | null;
  profile: Profile | null;
  bankAccounts: BankAccount[];
  loading: boolean;
  userLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any, user: User | null }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  signInWithPhoneNumber: (phone: string) => Promise<{ error: any }>;
  verifyPhoneOTP: (phone: string, token: string) => Promise<{ error: any, user: User | null }>;
  signInWithGoogleAccount: () => Promise<{ error: any }>;
  signInWithFacebookAccount: () => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}
