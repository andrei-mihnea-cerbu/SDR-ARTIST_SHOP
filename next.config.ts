import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    staleTimes: { dynamic: 0, static: 30 },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.amc-dev.com',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'api.smokindudesrecords.com' },
      { protocol: 'https', hostname: 'images-api.printify.com' },
      { protocol: 'https', hostname: 'images.printify.com' },
      { protocol: 'https', hostname: 'smokindudesrecords.com' },
    ],
  },
};

export default nextConfig;
