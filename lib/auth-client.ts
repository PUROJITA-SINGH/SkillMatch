// Better Auth client configuration for React frontend
import { createAuthClient } from "@better-auth/react"
import type { auth } from "./auth"

// Create the auth client for frontend use
export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === "production" 
    ? "https://your-domain.com" // Replace with your production domain
    : "http://localhost:3000",
  
  // This should match your Better Auth server configuration
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        console.error("Rate limited. Please try again later.")
      }
    },
  },
})

// Export auth methods for easy use in components
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  updateUser,
  changePassword,
  resetPassword,
  sendVerificationEmail,
} = authClient

// Custom hooks for better integration
export const useAuth = () => {
  const session = useSession()
  
  return {
    user: session.data?.user || null,
    session: session.data?.session || null,
    isLoading: session.isPending,
    isAuthenticated: !!session.data?.user,
    error: session.error,
  }
}

// Helper functions for authentication actions
export const authActions = {
  // Sign up with email and password
  signUpWithEmail: async (email: string, password: string, additionalData?: any) => {
    try {
      const result = await signUp.email({
        email,
        password,
        name: additionalData?.full_name || additionalData?.name,
        ...additionalData,
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return result.data
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  },

  // Sign in with email and password
  signInWithEmail: async (email: string, password: string) => {
    try {
      const result = await signIn.email({
        email,
        password,
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return result.data
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/dashboard", // Redirect after successful login
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return result.data
    } catch (error) {
      console.error("Google sign in error:", error)
      throw error
    }
  },

  // Sign in with GitHub
  signInWithGitHub: async () => {
    try {
      const result = await signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return result.data
    } catch (error) {
      console.error("GitHub sign in error:", error)
      throw error
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  },

  // Update user profile
  updateProfile: async (updates: any) => {
    try {
      const result = await updateUser(updates)
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      // Also update in Supabase
      const { supabase } = await import('./supabase')
      const session = await getSession()
      
      if (session.data?.user) {
        await supabase
          .from('users')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', session.data.user.id)
      }
      
      return result.data
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const result = await changePassword({
        currentPassword,
        newPassword,
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return result.data
    } catch (error) {
      console.error("Change password error:", error)
      throw error
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      const result = await resetPassword({
        email,
        redirectTo: "/auth/reset-password", // Your reset password page
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return result.data
    } catch (error) {
      console.error("Reset password error:", error)
      throw error
    }
  },

  // Send verification email
  sendVerificationEmail: async (email: string) => {
    try {
      const result = await sendVerificationEmail({
        email,
        redirectTo: "/auth/verify", // Your verification page
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return result.data
    } catch (error) {
      console.error("Send verification email error:", error)
      throw error
    }
  },
}

export default authClient
