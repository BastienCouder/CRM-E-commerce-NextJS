/** @type {import('next').NextConfig} */

const withFonts = require("next-fonts");

const nextConfig = {
  images: {
    domains: ["plus.unsplash.com"],
    remotePatterns: [{ hostname: "images.unsplash.com" }],
  },
  experimental: {
    serverActions: true,
  },

  async rewrites() {
    return [
      {
        source: "/profile",
        destination: "/pages/profile",
      },
      {
        source: "/cart",
        destination: "/pages/cart",
      },
      {
        source: "/collection",
        destination: "/pages/collection",
      },
      {
        source: "/cart/delivery",
        destination: "/pages/cart/delivery",
      },
      {
        source: "/cart/payment",
        destination: "/pages/cart/payment",
      },
      {
        source: "/wishlist",
        destination: "/pages/wishlist",
      },
      {
        source: "/products/:id",
        destination: "/pages/products/:id",
      },
      {
        source: "/Navbar",
        destination: "/pages/Navbar",
      },

      {
        source: "/mentions-legales",
        destination: "/pages/policy/legalInformation",
      },
      {
        source: "/politique-de-confidentialite",
        destination: "/pages/policy/privacyPolicy",
      },
      {
        source: "/politique-de-cookies",
        destination: "/pages/policy/cookiesPolicy",
      },
      {
        source: "/politique-de-remboursement",
        destination: "/pages/policy/refundPolicy",
      },
    ];
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
