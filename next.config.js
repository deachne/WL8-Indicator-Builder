/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Enable React Server Components
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
