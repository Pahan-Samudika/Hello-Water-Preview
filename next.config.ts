import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shadcnstudio.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/blogs", permanent: true },
      { source: "/product-category/products", destination: "/products", permanent: true },
      { source: "/testimonials", destination: "/about-us", permanent: true },
      { source: "/product/:slug", destination: "/products/:slug", permanent: true },
      {
        source: "/micro-plastics-in-australia-drinking-water",
        destination: "/blogs/micro-plastics-in-australia-drinking-water",
        permanent: true,
      },
      {
        source: "/the-bottle-water-plant-whole-house-micro-filtration",
        destination: "/blogs",
        permanent: true,
      },
      { source: "/benefits-of-water-filtration-system", destination: "/benefits", permanent: true },
      { source: "/benefits-of-filtered-water", destination: "/benefits", permanent: true },
      { source: "/micron-replacement-cartridge", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
