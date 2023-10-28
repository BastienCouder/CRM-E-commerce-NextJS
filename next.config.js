/** @type {import('next').NextConfig} */
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
    ];
  },
};

module.exports = nextConfig;
