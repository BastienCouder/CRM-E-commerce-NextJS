/** @type {import('next').NextConfig} */

const withFonts = require("next-fonts");

const nextConfig = {
  images: {
    domains: [
      "plus.unsplash.com",
      "lh3.googleusercontent.com",
      "other-allowed-domain.com",
    ],
    remotePatterns: [{ hostname: "images.unsplash.com" }],
    domains: ["lh3.googleusercontent.com", "other-allowed-domain.com"],
  },

  experimental: {
    serverActions: true,
  },

  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;

module.exports = withFonts({
  ...nextConfig,

  // Specify fonts configuration here
  fonts: {
    google: [
      {
        family: "Roboto",
        variants: ["regular", "italic", "500", "500italic", "700", "700italic"],
        // Specify subsets here
        // For example, to include only the 'latin' subset:
        subsets: ["latin"],
      },
      // Add more fonts as needed
    ],
  },
});
