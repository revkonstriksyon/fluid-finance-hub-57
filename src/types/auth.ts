
import { Session, User } from "@supabase/supabase-js";

export type ProfileType = {
  id: string;
  full_name: string;
  avatar_url: string;
  phone?: string;
  username?: string;
  location?: string;
  bio?: string;
  joined_date?: string;
  updated_at?: string;
};

// Export Profile type explicitly
export type Profile = ProfileType;

export type BankAccount = {
  id: string;
  user_id: string;
  account_name: string;
  account_type: string;
  balance: number;
  created_at: string;
};

export type PaymentMethod = {
  id: string;
  user_id: string;
  type: 'moncash' | 'natcash' | 'agent' | 'card';
  details: {
    moncash_phone?: string;
    natcash_phone?: string;
    agent_code?: string;
    card_last4?: string;
    card_brand?: string;
  };
  is_verified: boolean;
  created_at: string;
};

export type VirtualCard = {
  id: string;
  user_id: string;
  card_number: string;
  expiration: string;
  cvv: string;
  balance: number;
  is_active: boolean;
  created_at: string;
};

export type Bill = {
  id: string;
  user_id: string;
  type: 'electricity' | 'water' | 'rent' | 'internet';
  amount: number;
  bill_number: string;
  paid_at: string | null;
  created_at: string;
};

// Export AuthContextType interface explicitly
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: ProfileType | null;
  bankAccounts: BankAccount[] | null;
  loading: boolean;
  userLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password?: string) => Promise<{ error: any }>;
  signUp: (email: string, password?: string, name?: string) => Promise<{ error: any; user: User | null }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  signInWithPhoneNumber: (phone: string) => Promise<{ error: any }>;
  verifyPhoneOTP: (phone: string, token: string) => Promise<{ error: any; user: User | null }>;
  signInWithGoogleAccount: () => Promise<{ error: any }>;
  signInWithFacebookAccount: () => Promise<{error: any}>;
  refreshProfile: () => Promise<void>;
}

// Maintain default export for backward compatibility
export default AuthContextType;
