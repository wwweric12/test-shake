'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { WS_URL } from '@/constants/api';
import { webSocketService } from '@/services/chat/websocket';
import { ConnectionStatus } from '@/types/webSocket';

interface WebSocketContextValue {
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  error: Error | null;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function WebSocketProvider({ children, enabled = true }: WebSocketProviderProps) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    enabled ? 'CONNECTING' : 'DISCONNECTED',
  );
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!enabled || hasInitialized.current) return;

    hasInitialized.current = true;

    webSocketService.setEventListeners({
      onConnect: () => {
        setConnectionStatus('CONNECTED');
        setIsConnected(true);
        setError(null);
      },
      onDisconnect: () => {
        setConnectionStatus('DISCONNECTED');
        setIsConnected(false);
      },
      onError: (err) => {
        setConnectionStatus('ERROR');
        setIsConnected(false);
        setError(err);
      },
    });

    if (!webSocketService.isConnected()) {
      webSocketService.connect({
        url: WS_URL,
        reconnectDelay: 10000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        debug: process.env.NODE_ENV === 'development',
      });
    }

    return () => {
      hasInitialized.current = false;
      webSocketService.disconnect();
    };
  }, [enabled]);

  const value: WebSocketContextValue = {
    connectionStatus,
    isConnected,
    error,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}
