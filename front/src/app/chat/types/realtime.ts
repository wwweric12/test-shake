// WebSocket / Realtime 전용 타입
// ❗ REST, UI 타입 절대 import 금지

export interface WSMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string; // ISO 8601
}

export interface WSChatRoom {
  id: string;
  name: string;
  participantCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export type WSMessageType = 'message' | 'typing' | 'read' | 'join' | 'leave';

export interface WSMessageEnvelope<T = unknown> {
  type: WSMessageType;
  payload: T;
}
