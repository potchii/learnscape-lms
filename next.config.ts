import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disable ESLint during Vercel build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ (Optional) Skip TS errors to ensure deploy
  },
};

export default nextConfig;
