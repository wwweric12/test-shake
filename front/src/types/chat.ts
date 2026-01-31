import { ApiEmptyResponse, ApiResponse } from '@/types/common';

/**
 * 페이징 응답 공통 타입
 */
export interface PaginatedResponse<T> {
  content: T[];
  size: number;
  hasNext: boolean;
}

/**
 * 채팅방 정보
 * 백엔드 /chat/rooms GET 응답
 */
export interface ChatRoom {
  chatRoomId: number; // 채팅방 ID
  partnerId: number; // 상대방 ID
  partnerName: string; // 상대방 닉네임
  partnerProfileImage: string; // 상대방 프로필 이미지 URL
  lastMessage: string; // 마지막 메시지 내용
  lastMessageTime: string; // 마지막 메시지 시각 (ISO 8601)
  unreadCount: number; // 읽지 않은 메시지 수
  canSendMessage: boolean; // 메시지 전송 가능 여부
}

/**
 * 채팅방 목록 조회 응답
 * ApiResponse 재사용
 */
export type ChatRoomsResponse = ApiResponse<PaginatedResponse<ChatRoom>>;

/**
 * 채팅 메시지
 * 백엔드 /chat/messages/{chatRoomId}/enter GET 및
 * /chat/messages/{chatRoomId} GET 응답
 */
export interface ChatMessage {
  id: string; // 메시지 ID (MongoDB ObjectId)
  chatRoomId: number; // 채팅방 ID
  senderId: number; // 발신자 ID
  content: string; // 메시지 내용
  sentAt: string; // 전송 시각 (ISO 8601)
  isRead: boolean; // 읽음 여부
}

/**
 * 채팅 메시지 목록 조회 응답
 * ApiResponse 재사용
 */
export type ChatMessagesResponse = ApiResponse<PaginatedResponse<ChatMessage>>;

/**
 * 채팅방 입장 응답
 * ApiResponse 재사용
 */
export type ChatRoomEnterResponse = ApiResponse<{
  message: PaginatedResponse<ChatMessage>;
}>;

/**
 * 채팅방 생성 요청
 */
export interface CreateChatRoomRequest {
  partnerId: number; // 상대방 ID
}

/**
 * 채팅방 생성 응답
 * ApiResponse 재사용
 */
export type CreateChatRoomResponse = ApiResponse<number>; // 생성된 채팅방 ID

/**
 * 채팅 신고 요청
 */
export interface ReportChatRequest {
  chatRoomId: number;
  reason: string;
}

/**
 * 채팅방 나가기/신고 응답
 */
export type ExitResponse = ApiEmptyResponse;
export type ReportResponse = ApiEmptyResponse;

/**
 * UI에서 사용하는 확장된 메시지 타입
 * (내 메시지 여부, 프로필 정보 포함)
 */
export interface ChatMessageWithProfile extends ChatMessage {
  isMine: boolean; // 내가 보낸 메시지 여부
  senderName?: string; // 발신자 닉네임 (WebSocket으로 받은 경우)
  senderProfileImageUrl?: string; // 발신자 프로필 이미지 (WebSocket으로 받은 경우)
}
