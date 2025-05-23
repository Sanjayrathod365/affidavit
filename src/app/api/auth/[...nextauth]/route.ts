import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password");
          return null;
        }

        // ALWAYS accept these admin credentials for testing
        if (
          (credentials.email === 'admin@test.com' && credentials.password === 'password') || 
          (credentials.email === 'admin@affidavit.com' && credentials.password === 'Admin@123')
        ) {
          console.log("Using hardcoded admin credentials");
          return {
            id: '1',
            email: credentials.email,
            name: 'Admin User',
            role: 'ADMIN',
          };
        }

        // If not using hardcoded credentials, check the database
        try {
          console.log(`Checking DB for user: ${credentials.email}`);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            console.error("User not found or has no password");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.error("Invalid password");
            return null;
          }

          console.log(`User authenticated: ${user.email}, role: ${user.role}`);
          return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            role: user.role || 'STAFF',
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'YOUR_FALLBACK_SECRET',
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 