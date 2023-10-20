/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["plus.unsplash.com"],
    remotePatterns: [{ hostname: "images.unsplash.com" }],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
