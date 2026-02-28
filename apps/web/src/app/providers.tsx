'use client';

import { ReactNode, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Web3Provider } from '@/lib/wagmi';
import { useAuthStore, useThemeStore } from '@/store';
import { queryClient } from '@/lib/query-client';
import { Toaster } from 'sonner';
import { useWalletSync } from '@/hooks/use-wallet-sync';

/** Mounted inside Web3Provider so wagmi context is available */
function WalletSyncWatcher() {
  useWalletSync();
  return null;
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const theme = useThemeStore((s) => s.theme);

  // Restore user session on mount (cookies carry the auth token)
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Listen for system color-scheme changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const resolvedTheme =
    theme === 'system'
      ? typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <WalletSyncWatcher />
        {children}
        <Toaster
          theme={resolvedTheme}
          position="top-right"
          richColors
        />
      </Web3Provider>
    </QueryClientProvider>
  );
}
