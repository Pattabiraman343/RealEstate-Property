// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Images configuration for external domains
  images: {
    domains: ['localhost', '127.0.0.1'],
    // If using Next.js Image component with external URLs
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },

  // API proxy to avoid CORS issues
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },

  // Environment variables (optional)
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },

  // Enable React Strict Mode
  reactStrictMode: true,

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Compress responses
  compress: true,

  // Production build settings
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig