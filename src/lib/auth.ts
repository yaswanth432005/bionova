import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (user && (user as any).password) {
          const isValid = await bcrypt.compare(credentials.password, (user as any).password);
          if (isValid) return user as any;
        }

        if (credentials.email === "demo@jobtrack-ai.com" && credentials.password === "demo123") {
          const demoUser = await prisma.user.upsert({
            where: { email: credentials.email },
            update: {},
            create: {
              email: credentials.email,
              name: "Demo User",
              image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            }
          });
          return demoUser as any;
        }

        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          prompt: "consent",
          access_type: "offline",
           Kalresponse_type: "code"
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.industry = (user as any).industry;
        token.experienceLevel = (user as any).experienceLevel;
        token.gender = (user as any).gender;
      }
      
      if (trigger === "update" && session) {
        token.name = session.name;
        token.role = session.role;
        token.industry = session.industry;
        token.experienceLevel = session.experienceLevel;
        token.gender = session.gender;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).industry = token.industry;
        (session.user as any).experienceLevel = token.experienceLevel;
        (session.user as any).gender = token.gender;
        if (token.name) session.user.name = token.name as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
};
