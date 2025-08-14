/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server-side features
  experimental: {
    serverActions: true,
  },
  // Ensure environment variables are available
  env: {
    NEXT_PUBLIC_BaseUrl: process.env.NEXT_PUBLIC_BaseUrl,
  },
  // Allow external image domains
  images: {
    domains: ["ivory-legal-sheep-782.mypinata.cloud", "cdn.pixabay.com"],
  },
};

module.exports = nextConfig;
