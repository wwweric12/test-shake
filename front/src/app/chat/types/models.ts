export interface ChatUser {
  id: string;
  nickname: string;
  profileImageUrl?: string;
}

export interface ChatMessage {
  id: string;
  roomId: number;
  senderId: string;
  senderName?: string;
  content: string;
  createdAt: string;
  isMine: boolean;
}

export interface ChatRoom {
  id: number;
  name: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}
