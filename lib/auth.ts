// Better Auth configuration for SkillMatch
import { betterAuth } from "better-auth"
import { postgres } from "postgres"

// Create postgres connection using Supabase credentials
const sql = postgres(process.env.DATABASE_URL || "", {
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export const auth = betterAuth({
  // Database configuration - connects to your Supabase database
  database: {
    provider: "postgres",
    connection: sql,
  },
  
  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
    minPasswordLength: 8,
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  // User configuration
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "job_seeker",
        required: false,
      },
      full_name: {
        type: "string",
        required: false,
      },
      avatar_url: {
        type: "string", 
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      location: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      linkedin_url: {
        type: "string",
        required: false,
      },
      github_url: {
        type: "string",
        required: false,
      },
      portfolio_url: {
        type: "string",
        required: false,
      },
      years_experience: {
        type: "number",
        defaultValue: 0,
        required: false,
      },
      current_position: {
        type: "string",
        required: false,
      },
      current_company: {
        type: "string",
        required: false,
      },
      is_verified: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
      subscription_tier: {
        type: "string",
        defaultValue: "free",
        required: false,
      },
    },
  },

  // Social providers (configure these in your environment)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled: !!process.env.GITHUB_CLIENT_ID,
    },
  },

  // Rate limiting
  rateLimit: {
    window: 60, // 1 minute
    max: 10, // 10 requests per minute
  },

  // Advanced security
  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  // Plugins can be added here for additional features
  plugins: [
    // Add plugins like 2FA, organization management, etc.
  ],

  // Custom callbacks for integration with your Supabase setup
  callbacks: {
    async signUp({ user }) {
      // Sync user data with your Supabase users table
      try {
        const { supabase } = await import('./supabase')
        
        // Insert or update user in Supabase users table
        const { error } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: user.full_name || user.name,
            role: user.role || 'job_seeker',
            avatar_url: user.avatar_url,
            phone: user.phone,
            location: user.location,
            bio: user.bio,
            linkedin_url: user.linkedin_url,
            github_url: user.github_url,
            portfolio_url: user.portfolio_url,
            years_experience: user.years_experience || 0,
            current_position: user.current_position,
            current_company: user.current_company,
            is_verified: user.is_verified || false,
            subscription_tier: user.subscription_tier || 'free',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (error) {
          console.error('Error syncing user to Supabase:', error)
        }
      } catch (error) {
        console.error('Error in signUp callback:', error)
      }
    },

    async signIn({ user }) {
      // Update last login time and sync any changes
      try {
        const { supabase } = await import('./supabase')
        
        const { error } = await supabase
          .from('users')
          .update({
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        if (error) {
          console.error('Error updating user login time:', error)
        }
      } catch (error) {
        console.error('Error in signIn callback:', error)
      }
    },
  },
})

// Export types for TypeScript
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.User
