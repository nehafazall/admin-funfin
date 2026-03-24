import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        fullName: { label: "Full Name", type: "text" },
        id: { label: "Id", type: "text" },
        token: { label: "Token", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.id) {
          return null;
        }

        const user: User = {
          id: credentials?.id,
          name: credentials.fullName,
          email: credentials.email as string,
          token: credentials.token as string,
          role: credentials.role as string,
        } as User;

        return user || null;
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days — matches backend JWT_EXPIRES_IN
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.token = user.token;
        token.role = user.role as "superadmin" | "admin" | "mentor" | "counsilor";
        // Record when this token was issued so we can detect expiry.
        token.issuedAt = Date.now();
      }

      // If the backend token has expired (7 days), wipe it so the next API
      // call returns 401 and the Axios interceptor triggers signOut.
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (token.issuedAt && Date.now() - (token.issuedAt as number) > sevenDays) {
        return { ...token, token: undefined };
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.token = token.token as string;
        session.user.role = token.role as "superadmin" | "admin" | "mentor" | "counsilor";
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || "secret"
};


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      token?: string;
      image?: string;
      role?: "superadmin" | "admin" | "mentor" | "counsilor";
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    token?: string;
    image?: string;
    role?: "superadmin" | "admin" | "mentor" | "counsilor";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    token?: string;
    image?: string;
    role?: "superadmin" | "admin" | "mentor" | "counsilor";
    issuedAt?: number;
  }
}
