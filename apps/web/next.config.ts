import type { NextConfig } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const apiUploadPattern = (() => {
  try {
    const parsed = new URL(apiUrl);
    const pathname = `${parsed.pathname.replace(/\/$/, '')}/uploads/**`;
    return {
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      port: parsed.port || '',
      pathname,
    } as const;
  } catch (error) {
    console.warn('Invalid NEXT_PUBLIC_API_URL supplied, falling back to localhost:4000');
    return {
      protocol: 'http',
      hostname: 'localhost',
      port: '4000',
      pathname: '/api/uploads/**',
    } as const;
  }
})();

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Transpile packages from monorepo
  transpilePackages: ['@detrust/types', '@detrust/config'],
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      apiUploadPattern,
    ],
  },
  
  // Webpack configuration
  webpack: (config) => {
    // Handle native modules for WalletConnect/RainbowKit
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Fix for @metamask/sdk and other SSR issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'idb-keyval': false,
      '@react-native-async-storage/async-storage': false,
    };
    
    // Handle SVG as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/app',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
