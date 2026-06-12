import type { NextConfig } from "next";

const API_PROXY_TARGET =
  process.env.API_PROXY_TARGET?.trim().replace(/\/+$/, '') ||
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, '') ||
  'http://qwalx-02.qwa.brasil:8087';

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_PROXY_TARGET}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
