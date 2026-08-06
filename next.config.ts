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
