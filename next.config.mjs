/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ivory-legal-sheep-782.mypinata.cloud",
        pathname: "/ipfs/**",
      },
    ],
    domains: ["cdn.pixabay.com"],
  },
};
export default nextConfig;
