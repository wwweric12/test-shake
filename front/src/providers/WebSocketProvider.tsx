/**
 * WebSocket Provider
 *
 * 앱 전역에서 WebSocket 연결을 관리하는 Provider
 * 사용자가 로그인한 상태에서 자동으로 WebSocket 연결
 */

'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { WS_URL } from '@/constants/api';
import { webSocketService } from '@/services/chat/websocket';
import { ConnectionStatus } from '@/types/webSocket';

interface WebSocketContextValue {
  connectionStatus: ConnectionStatus; // 연결 상태
  isConnected: boolean; // 연결 여부
  error: Error | null; // 에러 정보
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
  enabled?: boolean; // WebSocket 연결 활성화 여부 (예: 로그인 상태에 따라)
}

/**
 * WebSocket Provider
 *
 * 앱 시작 시 WebSocket 연결을 자동으로 설정
 *
 * @example
 * // layout.tsx에서 사용
 * <WebSocketProvider enabled={isLoggedIn}>
 *   {children}
 * </WebSocketProvider>
 */
export function WebSocketProvider({ children, enabled = true }: WebSocketProviderProps) {
  // 초기 상태를 CONNECTING으로 설정 (enabled가 true일 때)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    enabled ? 'CONNECTING' : 'DISCONNECTED',
  );
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!enabled) {
      console.log('[WebSocketProvider] WebSocket 연결이 비활성화되었습니다.');
      return;
    }

    // 중복 초기화 방지
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    console.log('[WebSocketProvider] WebSocket 연결 시작');

    // 이벤트 리스너 등록 (모든 setState는 콜백 내부에서만 호출)
    webSocketService.setEventListeners({
      onConnect: () => {
        console.log('[WebSocketProvider] WebSocket 연결 성공');
        setConnectionStatus('CONNECTED');
        setIsConnected(true);
        setError(null);
      },
      onDisconnect: () => {
        console.log('[WebSocketProvider] WebSocket 연결 해제');
        setConnectionStatus('DISCONNECTED');
        setIsConnected(false);
      },
      onError: (err) => {
        console.error('[WebSocketProvider] WebSocket 에러:', err);
        setConnectionStatus('ERROR');
        setIsConnected(false);
        setError(err);
      },
    });

    // WebSocket 연결 (이미 연결되어 있으면 연결 시도하지 않음)
    if (!webSocketService.isConnected()) {
      webSocketService.connect({
        url: WS_URL,
        reconnectDelay: 10000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        debug: process.env.NODE_ENV === 'development',
      });
    }

    // 클린업: 연결 해제
    return () => {
      console.log('[WebSocketProvider] WebSocket 연결 해제 (cleanup)');
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

/**
 * WebSocket Context Hook
 *
 * WebSocket 연결 상태를 가져오는 Hook
 *
 * @example
 * const { isConnected, connectionStatus } = useWebSocket();
 */
export function useWebSocket() {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }

  return context;
}
