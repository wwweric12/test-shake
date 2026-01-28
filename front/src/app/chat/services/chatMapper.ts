import type { ChatRoom as ApiChatRoom } from '@/types/chat';

import type { ChatRoom } from '../types/models';

export function mapApiChatRoom(room: ApiChatRoom): ChatRoom {
  return {
    id: room.chatRoomId,
    name: room.otherUserNickname,
    lastMessage: room.lastMessage,
    lastMessageAt: room.lastMessageAt,
    unreadCount: room.unreadCount,
  };
}
