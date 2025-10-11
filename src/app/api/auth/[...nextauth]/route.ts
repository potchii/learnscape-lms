// This file MUST be a simple wrapper for NextAuth

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Should point to your configuration object

// Create the handler using the standard NextAuth function
const handler = NextAuth(authOptions);

// Export the GET and POST methods
export { handler as GET, handler as POST };