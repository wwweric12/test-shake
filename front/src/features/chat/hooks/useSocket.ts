/* eslint-disable no-console */
import { useCallback, useEffect, useRef, useState } from 'react';

import { USE_MOCK_SOCKET, WS_URL } from '@/lib/constants';
import { MockWebSocket } from '@/mocks/mockWebsocket';

import type { ConnectionStatus, WSMessage } from '../types';

interface UseSocketOptions {
  onMessage?: (message: WSMessage) => void;
  onTyping?: (data: { userId: string; username: string; isTyping: boolean }) => void;
  onRead?: (data: { messageId: string; readBy: string; readAt: string }) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

type WebSocketInstance = WebSocket | MockWebSocket;

export const useSocket = (options: UseSocketOptions = {}) => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const wsRef = useRef<WebSocketInstance | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountedRef = useRef(false);

  // options를 useRef로 관리하여 무한 재렌더링 방지
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // ✅ connect 함수를 먼저 선언
  const connectRef = useRef<(() => void) | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (isUnmountedRef.current) return;

    setStatus('connecting');

    // Mock 또는 실제 WebSocket 생성
    const ws: WebSocketInstance = USE_MOCK_SOCKET
      ? new MockWebSocket(WS_URL)
      : new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log(USE_MOCK_SOCKET ? '✅ Mock WebSocket connected' : '✅ WebSocket connected');
      setStatus('connected');
      optionsRef.current.onConnect?.();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as {
          type: string;
          payload:
            | WSMessage
            | { userId: string; username: string; isTyping: boolean }
            | { messageId: string; readBy: string; readAt: string };
        };
        console.log('📨 Received:', data);

        // 메시지 타입별 처리
        switch (data.type) {
          case 'message':
            if (optionsRef.current.onMessage) {
              optionsRef.current.onMessage(data.payload as WSMessage);
            }
            break;

          case 'typing':
            if (optionsRef.current.onTyping) {
              optionsRef.current.onTyping(
                data.payload as { userId: string; username: string; isTyping: boolean },
              );
            }
            break;

          case 'read':
            if (optionsRef.current.onRead) {
              optionsRef.current.onRead(
                data.payload as { messageId: string; readBy: string; readAt: string },
              );
            }
            break;

          default:
            console.warn('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setStatus('error');
      optionsRef.current.onError?.(error);
    };

    ws.onclose = () => {
      if (isUnmountedRef.current) return;

      console.log('🔌 WebSocket disconnected');
      setStatus('disconnected');
      optionsRef.current.onDisconnect?.();

      // ✅ connectRef를 통해 재연결
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('🔄 Reconnecting...');
        connectRef.current?.();
      }, 5000);
    };

    wsRef.current = ws;
  }, []);

  // ✅ connect를 connectRef에 할당
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    wsRef.current?.close();
    wsRef.current = null;
    setStatus('disconnected');
  }, []);

  const sendMessage = useCallback((type: string, payload: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  useEffect(() => {
    isUnmountedRef.current = false;

    return () => {
      isUnmountedRef.current = true;
      disconnect();
    };
  }, [disconnect]);

  return {
    status,
    connect,
    disconnect,
    sendMessage,
    isConnected: status === 'connected',
  };
};
