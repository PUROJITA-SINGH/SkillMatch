

import { createContext, useContext, ReactNode } from 'react';
import { useSession, signIn as nextSignIn, signOut as nextSignOut } from 'next-auth/react';

export interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: any;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, additionalData?: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const user = session?.user || null;
  const isLoading = status === 'loading';
  const isAuthenticated = !!user;

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error: null,
    signIn: async (email, password) => {
      await nextSignIn('credentials', { email, password, redirect: false });
    },
    signUp: async (email, password, additionalData) => {
      // Implement sign up logic using Supabase client
      // Example:
      // import { supabase } from '../lib/supabase';
      // await supabase.auth.signUp({ email, password, ...additionalData });
    },
    signInWithGoogle: async () => {
      await nextSignIn('google');
    },
    signInWithGitHub: async () => {
      await nextSignIn('github');
    },
    signOut: async () => {
      await nextSignOut();
    },
    updateProfile: async (updates) => {
      // Implement profile update logic using Supabase client
    },
    changePassword: async (currentPassword, newPassword) => {
      // Implement password change logic using Supabase client
    },
    resetPassword: async (email) => {
      // Implement password reset logic using Supabase client
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}