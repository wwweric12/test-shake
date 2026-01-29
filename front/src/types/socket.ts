// src/services/chat/types.ts
/**
 * WebSocket 전용 타입
 * REST API 타입(src/types/chat.ts)과 분리하여 관리
 */

export type MessageType = 'USER' | 'SYSTEM';

/**
 * WebSocket으로 수신하는 메시지
 * 백엔드 /sub/chat/room/{roomId} 응답
 */
export interface WSMessageReceive {
  userId: number;
  messageType: MessageType;
  content: string;
  sendTime: string; // ISO 8601
}

/**
 * WebSocket으로 전송하는 메시지
 * 백엔드 /pub/chat/messages 요청
 */
export interface WSMessageSend {
  chatRoomId: number;
  userId: number;
  content: string;
  messageType: MessageType;
}

/**
 * WebSocket 연결 상태
 */
export interface WebSocketConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
}
