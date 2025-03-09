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
