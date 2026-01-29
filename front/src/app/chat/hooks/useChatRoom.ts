'use client';

import { useCallback } from 'react';

import { useChatMessages } from '@/services/chat/hooks';

interface UseChatRoomParams {
  roomId: number;
  enabled?: boolean;
}

/**
 * 채팅방 메시지 조회 및 전송을 담당하는 Hook
 * 소켓연결 확장 이전버젼
 */
export function useChatRoom({ roomId, enabled = true }: UseChatRoomParams) {
  // 메시지 목록 조회
  const { data, isLoading, error } = useChatMessages(roomId, enabled);

  // 메시지 전송
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    //TODO: 소켓 연결
  }, []);

  return {
    messages: data?.data ?? [],
    isLoading,
    error,
    sendMessage,
  };
}
