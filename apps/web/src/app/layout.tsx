import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import '@/lib/polyfills/indexeddb';
import '@/styles/globals.css';
import { bodyFont, displayFont } from '@/styles/fonts';

export const metadata: Metadata = {
  title: {
    default: 'DeTrust - Decentralized Freelance Marketplace',
    template: '%s | DeTrust',
  },
  description: 'A trustless, AI-powered freelance marketplace built on blockchain technology. Connect with verified freelancers and clients with escrow-protected payments.',
  keywords: [
    'freelance',
    'blockchain',
    'decentralized',
    'web3',
    'smart contracts',
    'escrow',
    'AI',
    'freelancer marketplace',
  ],
  authors: [{ name: 'DeTrust Team' }],
  creator: 'DeTrust',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'DeTrust',
    title: 'DeTrust - Decentralized Freelance Marketplace',
    description: 'A trustless, AI-powered freelance marketplace built on blockchain technology.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DeTrust',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeTrust - Decentralized Freelance Marketplace',
    description: 'A trustless, AI-powered freelance marketplace built on blockchain technology.',
    images: ['/images/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/icons/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/icon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: ['/icons/icon-32x32.png'],
    apple: '/icons/apple-touch-icon.png',
    other: [
      { rel: 'mask-icon', url: '/icons/icon-512x512.png', color: '#0ebc8b' },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#f4f7fb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
      data-theme="detrust"
    >
      <body className="min-h-screen bg-base text-foreground antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
