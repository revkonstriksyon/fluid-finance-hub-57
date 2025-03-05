
import { User } from '@supabase/supabase-js';

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
