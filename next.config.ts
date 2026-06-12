import type { NextConfig } from "next";

const API_PROXY_TARGET = 'http://qwalx-02.qwa.brasil:8087';

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
