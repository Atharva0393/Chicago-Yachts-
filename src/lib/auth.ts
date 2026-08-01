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

        // DB AUTHENTICATION
        const { db } = await import("@/lib/db");
        const bcrypt = (await import("bcryptjs")).default;

        const admin = await db.adminUser.findUnique({
          where: { email: credentials.email.trim().toLowerCase() }
        });

        if (!admin) {
          console.log("LOGIN FAILED: User not found.");
          throw new Error("Invalid credentials");
        }

        if (!admin.isActive) {
          console.log("LOGIN FAILED: User is inactive.");
          throw new Error("Account is inactive");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, admin.passwordHash);

        if (!isValidPassword) {
          console.log("LOGIN FAILED: Incorrect password.");
          throw new Error("Invalid credentials");
        }

        console.log(`LOGIN SUCCESS: ${admin.email}`);
        
        // Update last login
        await db.adminUser.update({
          where: { id: admin.id },
          data: { lastLoginAt: new Date() }
        });

        return {
          id: admin.id,
          email: admin.email,
          name: `${admin.firstName} ${admin.lastName}`,
          role: admin.role
        };
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
