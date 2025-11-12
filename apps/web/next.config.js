/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    unoptimized: true, // penting agar bisa di-export
    domains: ["starfish-app-xrxoq.ondigitalocean.app", "localhost"], // semua domain
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**", // izinkan semua path backend
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*", // proxy ke backend
      },
    ];
  },
};

module.exports = nextConfig;
