import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets phones and other devices on the local network use hot reload in `next dev`
  allowedDevOrigins: ["10.111.52.46"],
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
