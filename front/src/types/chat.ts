export interface ChatRoom {
  chatRoomId: number;
  otherUserNickname: string;
  otherUserProfileImageUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatRoomsResponse {
  statusCode: number;
  message: string;
  data: ChatRoom[];
}

export interface ChatMessage {
  content: number; // Following api.md "content": 1
  sendTime: string;
  otherUserProfileImageUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessagesResponse {
  statusCode: number;
  message: string;
  data: ChatMessage[];
}

export interface ReportChatRequest {
  chatRoomId: number;
  reason: string;
}
