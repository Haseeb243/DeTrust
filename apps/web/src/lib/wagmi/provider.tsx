'use client';

import { ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, lightTheme, Theme } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from './config';

// Custom DeTrust theme for RainbowKit
const baseTheme = lightTheme({
  accentColor: '#0ebc8b',
  accentColorForeground: '#041b18',
  borderRadius: 'large',
  fontStack: 'rounded',
  overlayBlur: 'small',
});

const detrustTheme: Theme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
    modalBackground: '#ffffff',
    modalBorder: 'rgba(15, 23, 42, 0.08)',
    profileForeground: '#f7fafc',
    connectButtonBackground: '#0ebc8b',
    connectButtonInnerBackground: '#0aa175',
    connectButtonText: '#f0fdf4',
  },
  shadows: {
    ...baseTheme.shadows,
    connectButton: '0 18px 40px rgba(14, 188, 139, 0.35)',
  },
};

interface Web3ProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

export function Web3Provider({ children }: Web3ProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Fix hydration issues - only render on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render providers, but use suppressHydrationWarning
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={detrustTheme}
          modalSize="compact"
        >
          {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
