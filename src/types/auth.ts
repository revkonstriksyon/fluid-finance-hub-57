
import { Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  joined_date: string;
}

export interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  balance: number;
  currency: string;
}

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  bankAccounts: BankAccount[];
  loading: boolean;
  userLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any | null, user: User | null }>;
  signOut: () => Promise<{ error: any | null }>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  signInWithPhoneNumber: (phone: string) => Promise<{ error: any | null }>;
  verifyPhoneOTP: (phone: string, token: string) => Promise<{ error: any | null, user: User | null }>;
  signInWithGoogleAccount: () => Promise<{ error: any | null }>;
  signInWithFacebookAccount: () => Promise<{ error: any | null }>;
  refreshProfile: () => Promise<void>;
};
