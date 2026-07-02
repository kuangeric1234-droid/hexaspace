/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Membership was rebranded as Community
      { source: '/membership', destination: '/community', permanent: true },
      { source: '/membership/:path*', destination: '/community', permanent: true },
    ];
  },
};

export default nextConfig;
