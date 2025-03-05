
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper function for phone authentication
export const signInWithPhone = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });
  return { data, error };
};

// Helper function to verify OTP
export const verifyOTP = async (phone: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  return { data, error };
};

// Helper function for Google authentication
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { data, error };
};

// Helper function for Facebook authentication
export const signInWithFacebook = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { data, error };
};

// Helper function for Apple authentication
export const signInWithApple = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: window.location.origin,
    },
  });
  return { data, error };
};

// Helper for password reset 
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/set-new-password`,
  });
  return { data, error };
};

// Helper for updating user profile
export const updateUserProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Helper for creating auth activity records
export const recordAuthActivity = async (
  userId: string, 
  activityType: string, 
  details: string, 
  ipAddress?: string, 
  deviceInfo?: string
) => {
  const { data, error } = await supabase
    .from('auth_activity')
    .insert({
      user_id: userId,
      activity_type: activityType,
      details,
      ip_address: ipAddress,
      device_info: deviceInfo,
      created_at: new Date().toISOString()
    });

  return { data, error };
};

// Helper for getting user's active sessions
export const getActiveSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('active_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('last_active', { ascending: false });

  return { data, error };
};

// Helper for getting auth activity history
export const getAuthActivity = async (userId: string, limit?: number) => {
  const { data, error } = await supabase
    .from('auth_activity')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit || 10);

  return { data, error };
};
