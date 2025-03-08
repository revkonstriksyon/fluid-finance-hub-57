
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
