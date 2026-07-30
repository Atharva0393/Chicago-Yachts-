import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        console.log("LOGIN ATTEMPT RECEIVED:", { email: credentials.email, passLength: credentials.password.length });

        // MOCK AUTHENTICATION (Since there is no DB configured yet)
        if (
          credentials.email.trim().toLowerCase() === "admin@chicagoyachts.com" &&
          credentials.password.trim() === "admin123"
        ) {
          console.log("LOGIN SUCCESS MOCK");
          return {
            id: "mock-admin-1",
            email: "admin@chicagoyachts.com",
            name: "Super Admin",
            role: "SUPER_ADMIN"
          }
        }

        console.log("LOGIN FAILED MOCK: Credentials did not match.");

        throw new Error("Invalid credentials")
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only-change-me"
}
