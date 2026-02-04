import { ApiEmptyResponse, ApiResponse, PageResponse } from '@/types/common';

// GET /chat/rooms - 내 채팅방 목록 조회
export interface ChatRoom {
  chatRoomId: number;
  partnerId: number;
  partnerName: string;
  partnerProfileImage: string;
  partnerDsti: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  canSendMessage: boolean;
}

export type ChatRoomListResponse = ApiResponse<PageResponse<ChatRoom>>;

// POST /chat/rooms - 채팅방 생성
export interface CreateChatRoomRequest {
  partnerId: number;
}

export type CreateChatRoomResponse = ApiResponse<number>;

// DELETE /chat/rooms/{chatRoomId}/exit - 채팅방 나가기
export type ExitChatRoomResponse = ApiEmptyResponse;

// GET /chat/messages/{chatRoomId}/enter - 채팅방 입장
export interface ChatMessage {
  id: string;
  chatRoomId: number;
  senderId: number;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface EnterChatRoomData {
  userId: number;
  content: PageResponse<ChatMessage>;
}

export type EnterChatRoomResponse = ApiResponse<EnterChatRoomData>;

// GET /chat/messages/{chatRoomId} - 채팅 메시지 페이징 조회
export interface GetMessagesData {
  userId: number;
  content: PageResponse<ChatMessage>;
}

export type GetMessagesResponse = ApiResponse<GetMessagesData>;

// SEND /pub/chat/{chatRoomId}/send - 채팅 송수신 (WebSocket)
export interface SendMessageRequest {
  content: string;
}

// SEND /pub/chat/enter - 채팅방 입장 알림
export interface ChatRoomEnterRequest {
  chatRoomId: number;
}

// SEND /pub/chat/leave - 채팅방 퇴장 알림
export interface ChatRoomLeaveRequest {
  chatRoomId: number;
}

// SUBSCRIBE /user/queue/chat/{chatRoomId} - 채팅 수신 (WebSocket)
export interface ReceivedMessage {
  messageId: string;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  senderProfileImageUrl: string;
  dsti: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface ReceivedMessageData {
  message: ReceivedMessage;
  isMine: boolean;
}

export type ReceivedMessageResponse = ApiResponse<ReceivedMessageData>;

// SUBSCRIBE /user/queue/chat-list/update - 채팅 목록 업데이트
export interface ChatListUpdateData {
  chatRoomId: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export type ChatListUpdateResponse = ApiResponse<ChatListUpdateData>;

// GET /chat/messages/unread-count - 전체 안 읽은 메시지 수
export type UnreadCountResponse = ApiResponse<number>;

// POST /chat/rooms/{chatRoomId}/report - 채팅방 신고
export interface ReportChatRequest {
  chatroomId: number;
  reporteeId: number;
  content: string;
}

export type ReportChatResponse = ApiEmptyResponse;

// UI에서 사용하는 확장 메시지 타입
export interface ChatMessageWithProfile extends ChatMessage {
  isMine: boolean;
  senderName?: string;
  senderProfileImageUrl?: string;
  dsti: string;
}

// 파트너 정보
export interface PartnerInfo {
  partnerId: number;
  partnerName: string;
  partnerProfileImage: string | null;
  partnerDsti: string;
}
