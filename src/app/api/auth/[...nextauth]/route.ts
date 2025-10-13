// /app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "name@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // find user by email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user) return null;

                // verify password (passwordHash stored in db)
                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) return null;

                // You may want to reject users not yet accepted (applicants) depending on role:
                // if (user.role === 'APPLICANT') return null;

                // Return minimal user object for session (Prisma adapter also creates records)
                return { id: user.id, email: user.email, name: `${user.firstName} ${user.lastName}`, role: user.role };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // When user signs in, inject id and role into token
            if (user) {
                // user originates from authorize() or adapter
                // user.role might be undefined when adapter used—fetch from DB fallback
                token.id = (user as any).id ?? token.id;
                token.role = (user as any).role ?? token.role;
            }
            return token;
        },

        async session({ session, token }) {
            // expose user id and role to client session
            if (token) {
                (session as any).user = {
                    ...(session.user ?? {}),
                    id: token.id,
                    role: token.role,
                };
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login" // optional: custom sign-in page
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
