'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { WS_URL } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { webSocketService } from '@/services/socket/WebSocketService';
import { ChatListUpdateData, ChatRoom, ChatRoomListResponse } from '@/types/chat';
import { HomeBadgeCountData, HomeBadgeCountResponse } from '@/types/home';
import { NotificationUpdateData, NotificationUpdateResponse } from '@/types/notification';
import { ConnectionStatus} from '@/types/webSocket';

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
  const hasInitialized = useRef(false);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('DISCONNECTED');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

  useEffect(() => {
    if (!isConnected) return;

    const handleUpdate = (update: ChatListUpdateData) => {
      queryClient.setQueryData<ChatRoomListResponse>(QUERY_KEYS.CHAT.ROOMS(), (old) => {
        if (!old?.data?.content) return old;

        const content = old.data.content.map((room: ChatRoom) =>
          room.chatRoomId === update.chatRoomId
            ? {
                ...room,
                lastMessage: update.lastMessage,
                lastMessageTime: update.lastMessageTime,
                unreadCount: update.unreadCount,
              }
            : room,
        );

        content.sort(
          (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime(),
        );

        return { ...old, data: { ...old.data, content } };
      });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.UNREAD_COUNT() });
    };

    const handleNotificationUpdate = (newData: NotificationUpdateData) => {
      queryClient.setQueryData<NotificationUpdateResponse >(QUERY_KEYS.HOME.SUMMARY(), (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          totalLikeCount: newData.unreadCount,
          others: {
            profileImageUrl: [
              newData.targetImageUrl,
              ...(old.data.targetImageUrl || [])
            ].slice(0, 3),
            dsti: [
              newData.dsti,
              ...(old.data.dsti || [])
            ].slice(0, 3),
          }
        };
      });
    };

    const handleBadgeUpdate = (newData: HomeBadgeCountData) => {
    queryClient.setQueryData<HomeBadgeCountResponse>(QUERY_KEYS.HOME.SUMMARY(), (old) => {
    if (!old?.data) return old;

      return {
        ...old,
        totalUnreadMessages: newData.totalUnreadMessages, 
      };
    });

    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.UNREAD_COUNT() });
  };

    webSocketService.subscribeChatListUpdate(handleUpdate);
    webSocketService.subscribeNotification(handleNotificationUpdate);
    webSocketService.subscribeHomeBadgeCount(handleBadgeUpdate);

    return () => {
      webSocketService.unsubscribeChatListUpdate();
      webSocketService.unsubscribeNotification();
      webSocketService.unsubscribeHomeBadgeCount();
    }
  }, [isConnected, queryClient]);

  return (
    <WebSocketContext.Provider value={{ connectionStatus, isConnected, error }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used within WebSocketProvider');
  return ctx;
}
