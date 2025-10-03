import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { SupabaseClient } from "@supabase/supabase-js"
import { supabase } from "../../lib/supabase"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { email, password } = credentials
        // Query Supabase for user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error || !data.user) {
          throw new Error(error?.message || "Invalid credentials")
        }
        return { id: data.user.id, email: data.user.email, ...data.user }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.email = token.email
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
