// ===================================
// src/features/chat/types/converters.ts
// REST API ↔ WebSocket 타입 변환 유틸
// ===================================

// src/features/chat/types/converters.ts
import type { ChatMessage, ChatRoom } from '@/types/chat';

import type { WSChatRoom, WSMessage } from './index';

/**
 * REST API 채팅방 → WebSocket 채팅방 변환
 */
export function apiRoomToWSRoom(apiRoom: ChatRoom): WSChatRoom {
  return {
    id: String(apiRoom.chatRoomId),
    name: apiRoom.otherUserNickname,
    participantCount: 2, // 1:1 채팅이므로 항상 2
    lastMessage: apiRoom.lastMessage,
    lastMessageTime: apiRoom.lastMessageAt, // ✅ ISO 8601 string 그대로 전달
  };
}

/**
 * REST API 메시지 → WebSocket 메시지 변환
 * ⚠️ 주의: API 응답에 senderId가 없어서 추가 정보 필요
 */
export function apiMessageToWSMessage(
  apiMsg: ChatMessage,
  roomId: string,
  currentUserId: string,
): WSMessage {
  return {
    id: `${roomId}-${apiMsg.sendTime}`,
    roomId,
    senderId: 'unknown', // ⚠️ API 응답에 없음 - 백엔드에 추가 요청 필요
    senderName: 'Unknown',
    content: String(apiMsg.content),
    timestamp: apiMsg.sendTime,
    isOwn: false,
  };
}

/**
 * WebSocket 메시지 → 화면 표시용 변환
 */
export function wsMessageToDisplayMessage(
  wsMsg: WSMessage,
  currentUserId: string,
): WSMessage & { isOwn: boolean } {
  return {
    ...wsMsg,
    isOwn: wsMsg.senderId === currentUserId,
  };
}
