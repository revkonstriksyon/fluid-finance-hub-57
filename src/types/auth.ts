
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
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: any | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ user: User | null; session: Session | null; error: any | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithPhoneNumber: (phone: string) => Promise<{ error: any | null }>;
  verifyPhoneOTP: (phone: string, token: string) => Promise<{ error: any | null, user: User | null, session: Session | null }>;
  signInWithGoogleAccount: () => Promise<{ error: any | null }>;
  refreshProfile: () => Promise<void>;
};
