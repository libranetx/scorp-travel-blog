import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Vercel-specific optimizations
  swcMinify: true,
  compress: true,
};

export default nextConfig;
