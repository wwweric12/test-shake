// /**
//  * WebSocket 연결 및 메시지 관리를 위한 React Hook
//  *
//  * 주요 기능:
//  * - WebSocket 자동 연결/해제
//  * - 채팅방 구독 관리
//  * - 메시지 송수신
//  * - React Query와 상태 동기화
//  */

// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// import { WS_URL } from '@/constants/api';
// import { QUERY_KEYS } from '@/constants/queryKeys';
// import { useEnterChatRoom } from '@/services/chat/hooks';
// import { webSocketService } from '@/services/chat/websocket';
// import { ChatMessageWithProfile } from '@/types/chat';
// import { ConnectionStatus, ReceivedChatMessage } from '@/types/webSocket';

// import { useQueryClient } from '@tanstack/react-query';

// interface UseWebSocketChatParams {
//   chatRoomId: number; // 채팅방 ID
//   userId: number; // 현재 사용자 ID
//   enabled?: boolean; // WebSocket 연결 활성화 여부
// }

// interface UseWebSocketChatReturn {
//   messages: ChatMessageWithProfile[]; // 메시지 목록
//   sendMessage: (content: string) => void; // 메시지 전송 함수
//   connectionStatus: ConnectionStatus; // 연결 상태
//   isConnected: boolean; // 연결 여부
//   isLoading: boolean; // 로딩 상태
//   error: Error | null; // 에러 정보
// }

// /**
//  * WebSocket 채팅 Hook
//  *
//  * @example
//  * const { messages, sendMessage, isConnected } = useWebSocketChat({
//  *   chatRoomId: 12,
//  *   userId: 1,
//  * });
//  */
// export function useWebSocketChat({
//   chatRoomId,
//   userId,
//   enabled = true,
// }: UseWebSocketChatParams): UseWebSocketChatReturn {
//   const queryClient = useQueryClient();

//   // 상태 관리 - 초기 상태를 CONNECTING으로 설정
//   const [realtimeMessages, setRealtimeMessages] = useState<ChatMessageWithProfile[]>([]); // WebSocket으로 받은 메시지만
//   const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
//     enabled ? 'CONNECTING' : 'DISCONNECTED',
//   ); // 연결 상태
//   const [error, setError] = useState<Error | null>(null); // 에러 상태

//   // 중복 연결 방지를 위한 ref
//   const isConnectingRef = useRef(false);
//   const isSubscribedRef = useRef(false);

//   // 초기 메시지 로드 (REST API)
//   const { data: enterData, isLoading, error: enterError } = useEnterChatRoom(chatRoomId, enabled);

//   /**
//    * 수신된 WebSocket 메시지를 UI용 메시지로 변환
//    */
//   const convertToMessageWithProfile = useCallback(
//     (received: ReceivedChatMessage): ChatMessageWithProfile => {
//       return {
//         id: received.messageId, // WebSocket: messageId -> id
//         chatRoomId: received.chatRoomId,
//         senderId: received.senderId,
//         content: received.content,
//         sentAt: received.sentAt, // WebSocket: sentAt 그대로 사용
//         isRead: received.isRead,
//         isMine: received.senderId === userId, // 내 메시지 여부
//         senderName: received.senderName,
//         senderProfileImageUrl: received.senderProfileImageUrl,
//       };
//     },
//     [userId],
//   );

//   /**
//    * REST API로 받은 메시지를 UI용 메시지로 변환
//    */
//   const convertRestMessageToProfile = useCallback(
//     (msg: {
//       id: string;
//       chatRoomId: number;
//       senderId: number;
//       content: string;
//       sentAt: string;
//       isRead: boolean;
//     }): ChatMessageWithProfile => {
//       return {
//         ...msg,
//         isMine: msg.senderId === userId,
//       };
//     },
//     [userId],
//   );

//   /**
//    * 초기 메시지 (REST API) - useMemo로 파생 상태 계산
//    * useEffect 없이 enterData가 변경되면 자동 재계산
//    */
//   const initialMessages = useMemo(() => {
//     if (!enterData?.data?.message?.content) return [];

//     const loadedMessages = enterData.data.message.content.map(convertRestMessageToProfile);
//     console.log(`[useWebSocketChat] 초기 메시지 ${loadedMessages.length}개 로드됨`);
//     return loadedMessages;
//   }, [enterData, convertRestMessageToProfile]);

//   /**
//    * 전체 메시지 목록 = 초기 메시지 + 실시간 메시지
//    * useMemo로 계산하여 불필요한 재계산 방지
//    */
//   const messages = useMemo(() => {
//     // 중복 제거: 실시간 메시지 중 초기 메시지에 이미 있는 것 제거
//     const initialMessageIds = new Set(initialMessages.map((m) => m.id));
//     const uniqueRealtimeMessages = realtimeMessages.filter((m) => !initialMessageIds.has(m.id));

//     return [...initialMessages, ...uniqueRealtimeMessages];
//   }, [initialMessages, realtimeMessages]);

//   /**
//    * WebSocket 메시지 수신 핸들러
//    */
//   const handleMessageReceived = useCallback(
//     (received: ReceivedChatMessage) => {
//       const newMessage = convertToMessageWithProfile(received);

//       // 실시간 메시지 목록에 추가 (중복 방지)
//       setRealtimeMessages((prev) => {
//         const isDuplicate = prev.some((msg) => msg.id === newMessage.id);
//         if (isDuplicate) return prev;
//         return [...prev, newMessage];
//       });

//       // React Query 캐시 갱신 (채팅방 목록의 lastMessage 업데이트용)
//       queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
//     },
//     [convertToMessageWithProfile, queryClient],
//   );

//   /**
//    * WebSocket 연결
//    */
//   useEffect(() => {
//     if (!enabled || !chatRoomId || isConnectingRef.current) return;

//     isConnectingRef.current = true;

//     // 이벤트 리스너 등록 (모든 setState는 콜백 내부에서만 호출)
//     webSocketService.setEventListeners({
//       onConnect: () => {
//         console.log('[useWebSocketChat] WebSocket 연결됨');
//         setConnectionStatus('CONNECTED');
//         setError(null);
//       },
//       onDisconnect: () => {
//         console.log('[useWebSocketChat] WebSocket 연결 해제됨');
//         setConnectionStatus('DISCONNECTED');
//       },
//       onError: (err) => {
//         console.error('[useWebSocketChat] WebSocket 에러:', err);
//         setConnectionStatus('ERROR');
//         setError(err);
//       },
//     });

//     // 연결 시작 (이미 연결되어 있으면 연결 시도하지 않음)
//     if (!webSocketService.isConnected()) {
//       webSocketService.connect({
//         url: WS_URL,
//         reconnectDelay: 3000,
//         heartbeatIncoming: 10000,
//         heartbeatOutgoing: 10000,
//         debug: process.env.NODE_ENV === 'development',
//       });
//     }

//     return () => {
//       isConnectingRef.current = false;
//     };
//   }, [enabled, chatRoomId]);

//   /**
//    * 채팅방 구독
//    */
//   useEffect(() => {
//     if (!enabled || !chatRoomId || !webSocketService.isConnected() || isSubscribedRef.current) {
//       return;
//     }

//     isSubscribedRef.current = true;

//     // 구독 시작
//     const subscription = webSocketService.subscribe(chatRoomId, handleMessageReceived);

//     if (subscription) {
//       console.log(`[useWebSocketChat] 채팅방 ${chatRoomId} 구독 완료`);
//     }

//     // 클린업: 구독 해제
//     return () => {
//       if (subscription) {
//         console.log(`[useWebSocketChat] 채팅방 ${chatRoomId} 구독 해제`);
//         subscription.unsubscribe();
//         isSubscribedRef.current = false;
//       }
//     };
//   }, [enabled, chatRoomId, handleMessageReceived]);

//   /**
//    * 메시지 전송
//    */
//   const sendMessage = useCallback(
//     (content: string) => {
//       if (!content.trim()) {
//         console.warn('[useWebSocketChat] 빈 메시지는 전송할 수 없습니다.');
//         return;
//       }

//       if (!webSocketService.isConnected()) {
//         console.error('[useWebSocketChat] WebSocket이 연결되지 않았습니다.');
//         setError(new Error('WebSocket이 연결되지 않았습니다.'));
//         return;
//       }

//       try {
//         webSocketService.sendMessage(chatRoomId, content);
//         console.log('[useWebSocketChat] 메시지 전송:', content);
//       } catch (err) {
//         const error = err instanceof Error ? err : new Error('메시지 전송 실패');
//         console.error('[useWebSocketChat] 메시지 전송 에러:', error);
//         setError(error);
//       }
//     },
//     [chatRoomId],
//   );

//   return {
//     messages,
//     sendMessage,
//     connectionStatus,
//     isConnected: webSocketService.isConnected(),
//     isLoading,
//     error: error || (enterError as Error | null),
//   };
// }

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { WS_URL } from '@/constants/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useEnterChatRoom } from '@/services/chat/hooks';
import { webSocketService } from '@/services/chat/websocket';
import { ChatMessageWithProfile } from '@/types/chat';
import { ConnectionStatus, ReceivedChatMessage } from '@/types/webSocket';

import { useQueryClient } from '@tanstack/react-query';

interface UseWebSocketChatParams {
  chatRoomId: number;
  userId: number;
  enabled?: boolean;
}

interface UseWebSocketChatReturn {
  messages: ChatMessageWithProfile[];
  sendMessage: (content: string) => void;
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useWebSocketChat({
  chatRoomId,
  userId,
  enabled = true,
}: UseWebSocketChatParams): UseWebSocketChatReturn {
  const queryClient = useQueryClient();
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessageWithProfile[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    enabled ? 'CONNECTING' : 'DISCONNECTED',
  );
  const [error, setError] = useState<Error | null>(null);

  const isConnectingRef = useRef(false);

  const { data: enterData, isLoading, error: enterError } = useEnterChatRoom(chatRoomId, enabled);

  const convertToMessageWithProfile = useCallback(
    (received: ReceivedChatMessage): ChatMessageWithProfile => ({
      id: received.messageId,
      chatRoomId: received.chatRoomId,
      senderId: received.senderId,
      content: received.content,
      sentAt: received.sentAt,
      isRead: received.isRead,
      isMine: received.senderId === userId,
      senderName: received.senderName,
      senderProfileImageUrl: received.senderProfileImageUrl,
    }),
    [userId],
  );

  const initialMessages = useMemo(() => {
    if (!enterData?.data?.message?.content) return [];
    return enterData.data.message.content.map((msg) => ({
      ...msg,
      isMine: msg.senderId === userId,
    }));
  }, [enterData, userId]);

  const messages = useMemo(() => {
    const initialIds = new Set(initialMessages.map((m) => m.id));
    return [...initialMessages, ...realtimeMessages.filter((m) => !initialIds.has(m.id))];
  }, [initialMessages, realtimeMessages]);

  const handleMessageReceived = useCallback(
    (received: ReceivedChatMessage) => {
      const newMsg = convertToMessageWithProfile(received);
      setRealtimeMessages((prev) =>
        prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg],
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
    },
    [convertToMessageWithProfile, queryClient],
  );

  // WebSocket 연결
  useEffect(() => {
    if (!enabled || isConnectingRef.current) return;
    isConnectingRef.current = true;

    webSocketService.setEventListeners({
      onConnect: () => {
        setConnectionStatus('CONNECTED');
        setError(null);
      },
      onDisconnect: () => setConnectionStatus('DISCONNECTED'),
      onError: (err) => {
        setConnectionStatus('ERROR');
        setError(err);
      },
    });

    if (!webSocketService.isConnected()) {
      webSocketService.connect({
        url: WS_URL,
        reconnectDelay: 3000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        debug: process.env.NODE_ENV === 'development',
      });
    }

    return () => {
      isConnectingRef.current = false;
    };
  }, [enabled]);

  // 채팅방 구독
  useEffect(() => {
    if (!enabled || !chatRoomId) return;

    // 메시지 핸들러 등록
    webSocketService.messageHandlers.set(chatRoomId, handleMessageReceived);

    // 연결되어 있으면 바로 구독
    if (webSocketService.isConnected() && !webSocketService.isSubscribed(chatRoomId)) {
      webSocketService.subscribe(chatRoomId, handleMessageReceived);
    }

    return () => {
      webSocketService.unsubscribe(chatRoomId);
    };
  }, [chatRoomId, handleMessageReceived, enabled]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      try {
        webSocketService.sendMessage(chatRoomId, content);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('메시지 전송 실패'));
      }
    },
    [chatRoomId],
  );

  return {
    messages,
    sendMessage,
    connectionStatus,
    isConnected: webSocketService.isConnected(),
    isLoading,
    error: error || (enterError as Error | null),
  };
}
