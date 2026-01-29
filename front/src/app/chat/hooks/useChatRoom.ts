// 'use client';

// import { useCallback } from 'react';

// import { useChatMessages } from '@/services/chat/hooks';

// interface UseChatRoomParams {
//   roomId: number;
//   enabled?: boolean;
// }

// /**
//  * 채팅방 메시지 조회 및 전송을 담당하는 Hook
//  * 소켓연결 확장 이전버젼
//  */
// export function useChatRoom({ roomId, enabled = true }: UseChatRoomParams) {
//   // 메시지 목록 조회
//   const { data, isLoading, error } = useChatMessages(roomId, enabled);

//   // 메시지 전송
//   const sendMessage = useCallback(async (content: string) => {
//     if (!content.trim()) return;

//     //TODO: 소켓 연결
//   }, []);

//   return {
//     messages: data?.data ?? [],
//     isLoading,
//     error,
//     sendMessage,
//   };
// }
/**
 * 채팅방 Hook (WebSocket 기반)
 * 기존 REST API 기반에서 WebSocket 기반으로 전환
 *
 * useWebSocketChat을 래핑하여 기존 인터페이스 유지
 */

import { useWebSocketChat } from './useWebSocketChat';

interface UseChatRoomParams {
  roomId: number; // 채팅방 ID
  enabled?: boolean; // 활성화 여부
}

/**
 * 채팅방 메시지 조회 및 전송을 담당하는 Hook
 * WebSocket 연결을 통해 실시간 메시지 송수신
 *
 * @example
 * const { messages, sendMessage, isLoading } = useChatRoom({
 *   roomId: 12,
 * });
 */
export function useChatRoom({ roomId, enabled = true }: UseChatRoomParams) {
  // TODO: 실제 사용자 ID는 auth context나 zustand store에서 가져와야 함
  // 현재는 임시로 하드코딩 (예시용)
  const userId = 1; // ⚠️ 실제 구현 시 현재 로그인한 사용자 ID로 교체 필요

  // WebSocket 채팅 Hook 사용
  const { messages, sendMessage, connectionStatus, isConnected, isLoading, error } =
    useWebSocketChat({
      chatRoomId: roomId,
      userId,
      enabled,
    });

  return {
    messages, // 메시지 목록
    sendMessage, // 메시지 전송 함수
    isLoading, // 로딩 상태
    error, // 에러 정보
    connectionStatus, // WebSocket 연결 상태
    isConnected, // WebSocket 연결 여부
  };
}
