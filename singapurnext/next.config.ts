// next.config.ts

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.pixabay.com', 'www.istockphoto.com', 'images.unsplash.com', 'localhost', 'www.pexels.com'],
  },
};

export default nextConfig;
