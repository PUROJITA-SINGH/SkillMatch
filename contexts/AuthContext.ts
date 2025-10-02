import { createContext, useContext, ReactNode } from 'react';
import { useAuth, authActions } from '../lib/auth-client';
import type { User } from '../lib/auth';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: any;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, additionalData?: any) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithGitHub: () => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<any>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  const contextValue: AuthContextType = {
    user: auth.user,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    error: auth.error,
    signIn: authActions.signInWithEmail,
    signUp: authActions.signUpWithEmail,
    signInWithGoogle: authActions.signInWithGoogle,
    signInWithGitHub: authActions.signInWithGitHub,
    signOut: authActions.signOut,
    updateProfile: authActions.updateProfile,
    changePassword: authActions.changePassword,
    resetPassword: authActions.resetPassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}