import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shared.fastly.steamstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "www.cheapshark.com",
        pathname: "/img/stores/icons/**",
      },      
    ],
  }
};

export default nextConfig;
