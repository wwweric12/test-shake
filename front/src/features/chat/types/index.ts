export interface WSMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string; // ISO 8601 format
  isOwn?: boolean;
}

export interface WSChatRoom {
  id: string;
  name: string;
  participantCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface TypingUser {
  userId: string;
  username: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// WebSocket 메시지 프로토콜
export interface WSMessagePayload {
  type: 'message' | 'typing' | 'read' | 'join' | 'leave';
  payload: WSMessage | TypingUser | { roomId: string };
}
