'use client';

import { useCallback, useEffect, useState } from 'react';

import { BASE_URL, WS_URL } from '@/constants/api';
import { ChatMessageWithProfile } from '@/types/chat';
import { ConnectionStatus } from '@/types/webSocket';

import { useWebSocketChat } from './useWebSocketChat'; // WebSocket Hook

interface UseChatRoomParams {
  roomId: number;
  enabled?: boolean;
}

export function useChatRoom({ roomId, enabled = true }: UseChatRoomParams) {
  const [messages, setMessages] = useState<ChatMessageWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // WebSocket 연결 Hook
  const {
    messages: wsMessages,
    sendMessage,
    isConnected,
    connectionStatus,
  } = useWebSocketChat({ chatRoomId: roomId, userId: 1, enabled });

  // WebSocket 메시지 병합
  useEffect(() => {
    if (wsMessages.length > 0) {
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const filtered = wsMessages.filter((m) => !existingIds.has(m.id));
        return [...prev, ...filtered];
      });
    }
  }, [wsMessages]);

  // 초기 REST API 메시지 로드
  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const res = await fetch(`${WS_URL}/chat/rooms/${roomId}/messages?size=50`);
        if (!res.ok) throw new Error('메시지 로드 실패');
        const data = await res.json();
        setMessages(data.messages ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMessages();
  }, [roomId]);

  // 이전 메시지 불러오기 (무한 스크롤)
  const loadPreviousMessages = useCallback(
    async (cursor?: string) => {
      try {
        const size = 50;
        const params = new URLSearchParams();
        if (cursor) params.append('cursor', cursor);
        params.append('size', size.toString());

        const res = await fetch(`${WS_URL}/chat/rooms/${roomId}/messages?${params.toString()}`);
        if (!res.ok) return { messages: [], hasNext: false };

        const data = await res.json();
        // 이전 메시지를 앞쪽에 추가
        setMessages((prev) => [...data.messages.reverse(), ...prev]);
        return { messages: data.messages ?? [], hasNext: data.hasNext ?? false };
      } catch (err) {
        console.error('이전 메시지 로딩 실패', err);
        return { messages: [], hasNext: false };
      }
    },
    [roomId],
  );

  return {
    messages,
    sendMessage,
    isLoading,
    isConnected,
    connectionStatus,
    loadPreviousMessages,
  };
}
