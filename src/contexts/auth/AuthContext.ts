
import { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/auth';

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a hook for using the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
