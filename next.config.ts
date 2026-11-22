import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

// Hosts a phone or another computer may use to reach `next dev`: the local
// network and the usual port-forwarding tunnels (VS Code, ngrok, Cloudflare,
// localtunnel). Development only: production keeps the same-origin default.
const devHosts = [
  "10.111.52.46",
  "10.*.*.*",
  "192.168.*.*",
  "172.*.*.*",
  "**.devtunnels.ms",
  "**.ngrok-free.app",
  "**.ngrok.app",
  "**.ngrok.io",
  "**.trycloudflare.com",
  "**.loca.lt",
];

const nextConfig: NextConfig = {
  // Lets phones and other devices load the dev server's scripts (hot reload, hydration)
  allowedDevOrigins: devHosts,
  // ...and lets the quote form's Server Action run from those hosts in development.
  // VS Code port forwarding sends `Origin: localhost:3000` with the tunnel as
  // `x-forwarded-host`, so localhost must be accepted as an origin too.
  experimental: dev
    ? {
        serverActions: {
          allowedOrigins: [
            "localhost",
            "localhost:3000",
            "127.0.0.1:3000",
            ...devHosts,
            ...devHosts.map((h) => `${h}:3000`),
          ],
        },
      }
    : {},
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
