
// User profile with financial data
export interface FinancialUser {
  id: string;
  email: string;
  phone: string;
  balance: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

// Profile for user display information
export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  joined_date: string | null;
}

export type ExtendedProfile = Profile & {
  accountBalance?: number;
};

// Auth context type definition
export interface AuthContextType {
  user: FinancialUser | null;
  userProfile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  loginWithPhone: (phone: string) => Promise<{ error: any }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ error: any }>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, phone: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

// Bank account from database
export interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  account_status?: string;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}

// Transaction from database
export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer_sent' | 'transfer_received' | 'payment' | 'reversal';
  amount: number;
  description?: string;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  reference_id?: string;
  created_at: string;
}

// Bill payment record
export interface Bill {
  id: string;
  user_id: string;
  type: 'electricity' | 'water' | 'internet' | 'rent';
  amount: number;
  bill_number: string;
  paid_at?: string;
  created_at: string;
}

// Virtual card 
export interface VirtualCard {
  id: string;
  user_id: string;
  card_number: string;
  expiration: string;
  cvv: string;
  balance: number;
  is_active: boolean;
  created_at: string;
}

// Payment method
export interface PaymentMethod {
  id: string;
  user_id: string;
  type: string;
  details: any;
  is_verified: boolean;
  created_at: string;
}

// Admin log
export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_id: string;
  target_table: string;
  details: any;
  created_at: string;
}

// Notification
export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: 'email' | 'sms' | 'in-app';
  read: boolean;
  created_at: string;
}
