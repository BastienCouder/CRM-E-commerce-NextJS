/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.unsplash.com" }],
    domains: ["lh3.googleusercontent.com", "other-allowed-domain.com"],
  },

  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
