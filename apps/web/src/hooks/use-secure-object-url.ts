import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchSecureFile, releaseObjectUrl } from '@/lib/secure-files';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store';

export function useSecureObjectUrl(sourceUrl?: string | null) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef<string | null>(null);

  const updateObjectUrl = useCallback((nextUrl: string | null) => {
    if (cacheRef.current && cacheRef.current !== nextUrl) {
      releaseObjectUrl(cacheRef.current);
    }
    cacheRef.current = nextUrl;
    setObjectUrl(nextUrl);
  }, []);

  useEffect(() => {
    if (!sourceUrl || !isAuthenticated) {
      updateObjectUrl(null);
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false;

    const loadFile = async () => {
      setIsLoading(true);
      try {
        const file = await fetchSecureFile(sourceUrl, {
          token: api.getToken() ?? undefined,
          signal: controller.signal,
          attachObjectUrl: true,
        });
        if (cancelled) return;
        updateObjectUrl(file.objectUrl ?? null);
      } catch (error) {
        if ((error as Error)?.name !== 'AbortError') {
          console.warn('Unable to fetch secure file', error);
        }
        if (!cancelled) {
          updateObjectUrl(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadFile();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [sourceUrl, isAuthenticated, updateObjectUrl]);

  useEffect(() => () => {
    if (cacheRef.current) {
      releaseObjectUrl(cacheRef.current);
      cacheRef.current = null;
    }
  }, []);

  return { objectUrl, isLoading: isLoading && Boolean(sourceUrl && isAuthenticated) };
}
