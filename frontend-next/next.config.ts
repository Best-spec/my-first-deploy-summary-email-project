import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://127.0.0.1:8000/:path*/' 
      }
    ]
  }
};

export default nextConfig;
