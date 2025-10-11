/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['starfish-app-xrxoq.ondigitalocean.app'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*', // proxy ke backend
      },
    ];
  },
};

module.exports = nextConfig;
