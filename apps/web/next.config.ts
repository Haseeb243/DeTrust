import type { NextConfig } from 'next';
import type { RemotePattern } from 'next/dist/shared/lib/image-config';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const apiUploadPattern: RemotePattern = (() => {
  try {
    const parsed = new URL(apiUrl);
    const pathname = `${parsed.pathname.replace(/\/$/, '')}/uploads/**`;
    const protocol: RemotePattern['protocol'] = parsed.protocol === 'https:' ? 'https' : 'http';
    return {
      protocol,
      hostname: parsed.hostname,
      port: parsed.port || undefined,
      pathname,
    } satisfies RemotePattern;
  } catch (error) {
    console.warn('Invalid NEXT_PUBLIC_API_URL supplied, falling back to localhost:4000');
    return {
      protocol: 'http',
      hostname: 'localhost',
      port: '4000',
      pathname: '/api/uploads/**',
    } satisfies RemotePattern;
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
  
  // Turbopack (default for dev in Next.js 16)
  // Webpack externals/fallbacks are not needed — Turbopack handles SSR imports natively
  turbopack: {},

  // Webpack configuration (used for production build via --webpack flag)
  webpack: (config) => {
    // Handle native modules for WalletConnect/RainbowKit
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Fix for @metamask/sdk and other SSR issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'idb-keyval': false,
      '@react-native-async-storage/async-storage': false,
    };

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
