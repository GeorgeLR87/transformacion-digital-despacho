import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // process.cwd() = portal/app cuando se ejecuta npm run dev desde esa carpeta
    root: process.cwd(),
  },
};

export default nextConfig;
