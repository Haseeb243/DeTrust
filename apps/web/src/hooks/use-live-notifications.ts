'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

let socket: Socket | null = null;

export function useLiveNotifications(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    let socketBaseUrl = 'http://localhost:4000';

    try {
      const parsed = new URL(apiUrl);
      socketBaseUrl = `${parsed.protocol}//${parsed.host}`;
    } catch {
      socketBaseUrl = apiUrl.replace(/\/api\/?$/, '');
    }

    socket = io(socketBaseUrl, {
      path: '/ws',
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    socket.on('notification:new', () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    socket.on('contract:status', (data: { contractId: string }) => {
      queryClient.invalidateQueries({ queryKey: ['contracts', 'detail', data.contractId] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    });

    socket.on('connect_error', (err) => {
      console.warn('[ws] connection error:', err.message);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [userId, queryClient]);
}
