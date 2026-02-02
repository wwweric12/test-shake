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
  // WebSocket 연결 상태 관리
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    enabled ? 'CONNECTING' : 'DISCONNECTED',
  );
  // 연결 여부 플래그
  const [isConnected, setIsConnected] = useState(false);
  // 에러 상태 저장
  const [error, setError] = useState<Error | null>(null);
  // 중복 초기화 방지 플래그
  const hasInitialized = useRef(false);

  // WebSocket 이벤트 리스너 등록
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

    // WebSocket 연결 시작
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
      // 클린업 시 연결 해제
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
