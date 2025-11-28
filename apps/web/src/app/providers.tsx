'use client';

import { ReactNode, useEffect } from 'react';
import { Web3Provider } from '@/lib/wagmi';
import { useAuthStore } from '@/store';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const { fetchUser, token } = useAuthStore();

  // Restore user session on mount
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <Web3Provider>
      {children}
      <Toaster
        theme="light"
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: '#ffffff',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            boxShadow: '0 20px 70px rgba(15, 23, 42, 0.08)',
          },
        }}
      />
    </Web3Provider>
  );
}
