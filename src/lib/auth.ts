import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
  interface Session {
      user: User;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        console.log(`[Auth Attempt] Email: ${credentials?.email}`);

        if (!credentials?.email || !credentials?.password) {
            console.error("[Auth Error] Missing email or password");
            return null;
        }

        try {
          // 1. Find user by email in the database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.error(`[Auth Error] No user found: ${credentials.email}`);
            return null; // User not found
          }
          
          // Log the ID found in the database
          console.log(`[Auth Check] User found in DB. ID: ${user.id}, Email: ${user.email}`);

          // Add check for null email
          if (!user.email) {
              console.error(`[Auth Error] User record email is null: ${credentials.email}`);
              return null; // Cannot authenticate user without an email
          }

          // 2. Check if user has a password set in the DB
          if (!user.password) {
            console.error(`[Auth Error] User password is null: ${credentials.email}`);
            return null; 
          }

          // 3. Compare provided password with hashed password in DB
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password // Safe now because we checked for null above
          );

          if (!isPasswordValid) {
            console.error(`[Auth Error] Invalid password for: ${credentials.email}`);
            return null; // Passwords don't match
          }

          // 4. Check if user has a role assigned
          if (!user.role) {
              console.error(`[Auth Error] User role is null: ${credentials.email}`);
              return null; // Role is required
          }

          // 5. Passwords match & role exists - return user object with DB data
          const userToReturn = {
            id: user.id, 
            email: user.email,
            name: user.name ?? '',
            role: user.role,
          };

          // Log the object being returned
          console.log(`[Auth Success] Returning user object:`, JSON.stringify(userToReturn)); 

          return userToReturn;

        } catch (error) {
          console.error("[Auth Error] Exception during authorization:", error);
          return null; // Return null on any error
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
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
        if (token.id) { session.user.id = token.id as string; }
        if (token.role) { session.user.role = token.role as string; }
      }
      return session;
    },
  },
}; 