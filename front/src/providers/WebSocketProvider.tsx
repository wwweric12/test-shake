'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { WS_URL } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { webSocketService } from '@/services/chat/websocket';
import { ChatListUpdateData, ChatRoom, ChatRoomListResponse } from '@/types/chat';
import { ConnectionStatus } from '@/types/webSocket';

import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    enabled ? 'CONNECTING' : 'DISCONNECTED',
  );
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasInitialized = useRef(false);

  // WebSocket 연결
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

  // 채팅 목록 실시간 업데이트 구독
  useEffect(() => {
    if (!isConnected) return;

    webSocketService.subscribeChatListUpdate((updateData: ChatListUpdateData) => {
      queryClient.setQueryData<ChatRoomListResponse>(QUERY_KEYS.CHAT.ROOMS(), (oldData) => {
        if (!oldData?.data?.content) return oldData;

        const updatedContent = oldData.data.content.map((room: ChatRoom) => {
          if (room.chatRoomId === updateData.chatRoomId) {
            return {
              ...room,
              lastMessage: updateData.lastMessage,
              lastMessageTime: updateData.lastMessageTime,
              unreadCount: updateData.unreadCount,
            };
          }
          return room;
        });

        updatedContent.sort((a, b) => {
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        });

        return {
          ...oldData,
          data: {
            ...oldData.data,
            content: updatedContent,
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.UNREAD_COUNT() });
    });

    return () => {
      webSocketService.unsubscribeChatListUpdate();
    };
  }, [isConnected, queryClient]);

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
