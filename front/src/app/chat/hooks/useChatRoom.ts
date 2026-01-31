/* eslint-disable no-console */
'use client';

import { useCallback, useState } from 'react';

import { MESSAGE_PAGE_SIZE } from '@/constants/message';
import { chatApi } from '@/services/chat/api';
import { ChatMessageWithProfile } from '@/types/chat';

import { useWebSocketChat } from './useWebSocketChat';

interface UseChatRoomParams {
  roomId: number;
  currentUserId: number; // 현재 로그인한 사용자 ID
  partnerInfo?: {
    partnerId: number;
    partnerName: string;
    partnerProfileImage: string | null;
  };
  enabled?: boolean;
}

export function useChatRoom({
  roomId,
  currentUserId,
  partnerInfo,
  enabled = true,
}: UseChatRoomParams) {
  const [additionalMessages, setAdditionalMessages] = useState<ChatMessageWithProfile[]>([]);

  // WebSocket 연결 및 초기 메시지 로드
  const {
    messages: wsMessages,
    sendMessage,
    isConnected,
    connectionStatus,
    isLoading,
    error,
  } = useWebSocketChat({
    chatRoomId: roomId,
    currentUserId,
    partnerInfo,
    enabled,
  });

  /**
   * 이전 메시지 불러오기 (무한 스크롤)
   * 백엔드 API: GET /chat/messages/{chatRoomId}?cursor=2026-01-29T21:10:30&size=50
   * 응답: { statusCode, message, data: { content: [...], size, hasNext } }
   */
  const loadPreviousMessages = useCallback(
    async (cursor?: string) => {
      try {
        const response = await chatApi.getChatMessages(roomId, cursor, MESSAGE_PAGE_SIZE);

        if (!response.data?.content) {
          return { messages: [], hasNext: false };
        }

        // 백엔드 응답을 ChatMessageWithProfile로 변환
        const loadedMessages: ChatMessageWithProfile[] = response.data.content.map((msg) => {
          // 백엔드에서 isMine을 현재 미제공 -> 추후 제공시 수정
          const isMine = msg.senderId === currentUserId;

          return {
            ...msg,
            isMine,
            senderName: isMine ? undefined : partnerInfo?.partnerName, // 상대방 프로필 정보 추가
            senderProfileImageUrl: isMine
              ? undefined
              : partnerInfo?.partnerProfileImage || undefined,
          };
        });

        // 추가 메시지 저장 (중복 방지)
        setAdditionalMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMessages = loadedMessages.filter((m) => !existingIds.has(m.id));
          return [...newMessages, ...prev]; // 앞쪽에 추가 (오래된 메시지)
        });

        return {
          messages: loadedMessages,
          hasNext: response.data.hasNext,
        };
      } catch (err) {
        console.error('[useChatRoom] 이전 메시지 로딩 실패:', err);
        return { messages: [], hasNext: false };
      }
    },
    [roomId, currentUserId, partnerInfo],
  );

  // 전체 메시지 = 추가 로드된 메시지 + WebSocket 메시지
  // wsMessages는 이미 시간순 정렬되어 있음
  const allMessages = [...additionalMessages, ...wsMessages];

  return {
    messages: allMessages,
    sendMessage,
    isLoading,
    isConnected,
    connectionStatus,
    error,
    loadPreviousMessages,
  };
}
