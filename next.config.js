/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "other-allowed-domain.com" },
    ],
  },

  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
