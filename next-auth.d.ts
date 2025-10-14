import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            firstName: string;
            lastName: string;
            role: string;
            email: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        firstName: string;
        lastName: string;
        role: string;
        email: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        firstName: string;
        lastName: string;
        role: string;
        email: string;
    }
}
