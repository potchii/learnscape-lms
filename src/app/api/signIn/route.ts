// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Create the handler using the standard NextAuth function
const handler = NextAuth(authOptions);

// Export the GET and POST methods
export { handler as GET, handler as POST };