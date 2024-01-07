/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "other-allowed-domain.com" },
    ],
  },
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en", "zh-CN"],
  },

  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
