import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Start with request-time APIs; introduce caching deliberately for each product.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
