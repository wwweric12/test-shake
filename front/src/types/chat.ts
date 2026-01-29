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

export interface ChatRoomMessage {
  content: number; // Following api.md "content": 1
  sendTime: string;
  otherUserProfileImageUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

// 수정: 실제 API 응답 구조에 맞게 재정의
export interface ChatMessage {
  messageId: number; // 메시지 고유 ID => 백엔드 메세지 정렬 기준 확인 필요(id 혹은 createdAt)
  chatRoomId: number; // 채팅방 ID
  senderId: string; // 발신자 ID
  senderNickname: string; // 발신자 닉네임
  senderProfileUrl: string;
  content: string; // ✅ number → string (메시지 내용)
  sendTime: string; // ISO 8601 타임스탬프
  isRead?: boolean; // 읽음 여부 => 여유시 구현할 예정
  isMine: boolean; // 내가 보낸 메시지 여부
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

// ✅ 메시지 전송 요청 타입 추가
export interface SendMessageRequest {
  chatRoomId: number;
  content: string;
}

export interface SendMessageResponse {
  statusCode: number;
  message: string;
  data: ChatMessage;
}
