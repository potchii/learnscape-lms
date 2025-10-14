import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt';
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';

// Initialize Prisma Client
//const prisma = new PrismaClient();

// This object holds all your NextAuth configuration
export const authOptions: NextAuthOptions = {
    // Session strategy determines how sessions are managed
    session: {
        strategy: 'jwt',
    },

    // Define the provider(s) you will use
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                emailOrUsername: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                if (!credentials) return null;

                // 1. Find the user by email or username
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.emailOrUsername },
                            { userName: credentials.emailOrUsername },
                        ],
                    },
                });

                if (!user) {
                    // User not found
                    return null;
                }

                // 2. Compare the submitted password with the stored hash
                // Note: Ensure you installed bcrypt: npm install bcrypt
                const passwordIsValid = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (passwordIsValid) {
                    // 3. Success! Return the user object (NextAuth requires this to be returned)
                    // Note: We MUST map the accessLevel (int) back to the role name for the JWT token
                    return {
                        id: String(user.id), // ID must be a string
                        name: user.firstName,
                        email: user.email,
                        role: user.role, // This is the UserRole enum value (e.g., 'ADMIN')
                    };
                } else {
                    // Invalid password
                    return null;
                }
            }
        }),
    ],

    // Callbacks are essential for getting the role into the session
    callbacks: {
        async jwt({ token, user }) {
            // Persist the role to the token during login
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            // Add the role from the token to the session object
            if (token.role) {
                (session.user as any).role = token.role;
            }
            return session;
        },
    },

    // Point NextAuth to your custom login page
    pages: {
        signIn: '/',
    },

    // Ensure you have a secure secret in your .env
    secret: process.env.NEXTAUTH_SECRET,
};