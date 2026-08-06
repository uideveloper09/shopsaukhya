import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.logicalfire.com",
        pathname: "/saukhya/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopsaukhya.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/shop/all-styles", destination: "/shop", permanent: true },
      {
        source: "/shop/kurta-sets",
        destination: "/shop?subcategory=5",
        permanent: false,
      },
      {
        source: "/shop/dresses",
        destination: "/shop?subcategory=3",
        permanent: false,
      },
      {
        source: "/shop/tops",
        destination: "/shop?subcategory=2",
        permanent: false,
      },
      {
        source: "/shop/co-ord-sets",
        destination: "/shop?subcategory=4",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/storefront-api/:path*",
        destination: "https://www.shopsaukhya.com/storefront-api/:path*",
      },
    ];
  },
};

export default nextConfig;
