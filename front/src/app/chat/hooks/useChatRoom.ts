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
// /**
//  * 채팅방 Hook (WebSocket 기반)
//  * 기존 REST API 기반에서 WebSocket 기반으로 전환
//  *
//  * useWebSocketChat을 래핑하여 기존 인터페이스 유지
//  */

// import { useWebSocketChat } from './useWebSocketChat';

// interface UseChatRoomParams {
//   roomId: number; // 채팅방 ID
//   enabled?: boolean; // 활성화 여부
// }

// /**
//  * 채팅방 메시지 조회 및 전송을 담당하는 Hook
//  * WebSocket 연결을 통해 실시간 메시지 송수신
//  *
//  * @example
//  * const { messages, sendMessage, isLoading } = useChatRoom({
//  *   roomId: 12,
//  * });
//  */
// export function useChatRoom({ roomId, enabled = true }: UseChatRoomParams) {
//   // TODO: 실제 사용자 ID는 auth context나 zustand store에서 가져와야 함
//   // 현재는 임시로 하드코딩 (예시용)
//   const userId = 1; // ⚠️ 실제 구현 시 현재 로그인한 사용자 ID로 교체 필요

//   // WebSocket 채팅 Hook 사용
//   const { messages, sendMessage, connectionStatus, isConnected, isLoading, error } =
//     useWebSocketChat({
//       chatRoomId: roomId,
//       userId,
//       enabled,
//     });

//   return {
//     messages, // 메시지 목록
//     sendMessage, // 메시지 전송 함수
//     isLoading, // 로딩 상태
//     error, // 에러 정보
//     connectionStatus, // WebSocket 연결 상태
//     isConnected, // WebSocket 연결 여부
//   };
// // }
// /**
//  * 채팅방 Hook (WebSocket 기반)
//  * 기존 REST API 기반에서 WebSocket 기반으로 전환
//  *
//  * useWebSocketChat을 래핑하여 기존 인터페이스 유지
//  * 무한 스크롤(이전 메시지 불러오기) 기능 포함
//  */

// import { useCallback, useState } from 'react';

// import { ChatMessageWithProfile } from '@/types/chat';

// import { useWebSocketChat } from './useWebSocketChat';

// interface UseChatRoomParams {
//   roomId: number; // 채팅방 ID
//   enabled?: boolean; // 활성화 여부
// }

// /**
//  * 채팅방 메시지 조회 및 전송을 담당하는 Hook
//  * WebSocket 연결을 통해 실시간 메시지 송수신
//  */
// export function useChatRoom({ roomId, enabled = true }: UseChatRoomParams) {
//   // TODO: 실제 사용자 ID는 auth context나 zustand store에서 가져와야 함
//   const userId = 1; // 예시용

//   // WebSocket 채팅 Hook 사용
//   const {
//     messages: wsMessages,
//     sendMessage,
//     connectionStatus,
//     isConnected,
//     isLoading,
//     error,
//   } = useWebSocketChat({
//     chatRoomId: roomId,
//     userId,
//     enabled,
//   });

//   // 무한 스크롤용 이전 메시지 상태
//   const [messages, setMessages] = useState<ChatMessageWithProfile[]>([]);
//   const [hasPrevious, setHasPrevious] = useState(true);

//   // WebSocket으로 들어오는 메시지는 항상 append
//   // 초기 로딩 시 wsMessages를 setMessages에 반영
//   const updateMessagesFromWS = useCallback((newMessages: ChatMessageWithProfile[]) => {
//     setMessages((prev) => {
//       // 중복 제거
//       const existingIds = new Set(prev.map((m) => m.id));
//       const filtered = newMessages.filter((m) => !existingIds.has(m.id));
//       return [...prev, ...filtered];
//     });
//   }, []);

//   // WebSocket 메시지 변화를 감지하면 업데이트
//   // useEffect 없이 간단하게 sync
//   if (wsMessages.length > messages.length) {
//     updateMessagesFromWS(wsMessages);
//   }

//   /**
//    * 이전 메시지 불러오기 (무한 스크롤)
//    * @param cursor 가장 오래된 메시지의 sentAt 값
//    */
//   const loadPreviousMessages = useCallback(
//     async (cursor?: string) => {
//       if (!hasPrevious) return { messages: [], hasNext: false };

//       try {
//         // TODO: 실제 API 호출로 변경
//         // 예시: GET /api/chat/{roomId}/messages?before={cursor}
//         const response = await fetch(`/api/chat/${roomId}/messages?before=${cursor ?? ''}`);
//         const data: { messages: ChatMessageWithProfile[]; hasNext: boolean } =
//           await response.json();

//         // 이전 메시지 prepend
//         setMessages((prev) => [...data.messages, ...prev]);

//         // 다음 페이지 여부
//         setHasPrevious(data.hasNext);

//         return data;
//       } catch (err) {
//         console.error('이전 메시지 로딩 실패', err);
//         return { messages: [], hasNext: false };
//       }
//     },
//     [roomId, hasPrevious],
//   );

//   return {
//     messages,
//     sendMessage,
//     isLoading,
//     error,
//     connectionStatus,
//     isConnected,
//     loadPreviousMessages, // ✅ ChatRoomView의 onLoadPrevious에 전달 가능
//   };
// }
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
