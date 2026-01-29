// import { ApiEmptyResponse, ApiResponse } from '@/types/common';

// export interface ChatRoom {
//   chatRoomId: number;
//   otherUserNickname: string;
//   otherUserProfileImageUrl: string;
//   lastMessage: string;
//   lastMessageAt: string;
//   unreadCount: number;
// }

// export type ChatRoomsResponse = ApiResponse<ChatRoom[]>;

// export interface ChatRoomMessage {
//   content: number; // Following api.md "content": 1
//   sendTime: string;
//   otherUserProfileImageUrl: string;
//   lastMessage: string;
//   lastMessageAt: string;
//   unreadCount: number;
// }

// // 수정: 실제 API 응답 구조에 맞게 재정의
// export interface ChatMessage {
//   messageId: number; // 메시지 고유 ID => 백엔드 메세지 정렬 기준 확인 필요(id 혹은 createdAt)
//   chatRoomId: number; // 채팅방 ID
//   senderId: string; // 발신자 ID
//   senderNickname: string; // 발신자 닉네임
//   senderProfileUrl: string;
//   content: string; // ✅ number → string (메시지 내용)
//   sendTime: string; // ISO 8601 타임스탬프
//   isRead?: boolean; // 읽음 여부 => 여유시 구현할 예정
//   isMine: boolean; // 내가 보낸 메시지 여부
// }

// export type ChatMessagesResponse = ApiResponse<ChatMessage[]>;

// export interface ReportChatRequest {
//   chatRoomId: number;
//   reason: string;
// }

// export type ExitResponse = ApiEmptyResponse;
// export type ReportResponse = ApiEmptyResponse;

// // ✅ 메시지 전송 요청 타입 추가

// // ✅ 메시지 전송 요청 타입 추가
// export interface SendMessageRequest {
//   chatRoomId: number;
//   content: string;
// }

// export type SendMessageResponse = ApiResponse<ChatMessage>;
import { ApiEmptyResponse, ApiResponse } from '@/types/common';

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
 */
export interface ChatRoomsApiResponse {
  statusCode: number;
  message: string;
  data: {
    content: ChatRoom[];
    size: number;
    hasNext: boolean;
  };
}

export type ChatRoomsResponse = ChatRoomsApiResponse;

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
 */
export interface ChatMessagesApiResponse {
  statusCode: number;
  message: string;
  data: {
    content: ChatMessage[];
    size: number;
    hasNext: boolean;
  };
}

/**
 * 채팅방 입장 응답
 */
export interface ChatRoomEnterApiResponse {
  statusCode: number;
  message: string;
  data: {
    message: {
      content: ChatMessage[];
      size: number;
      hasNext: boolean;
    };
  };
}

export type ChatMessagesResponse = ChatMessagesApiResponse;
export type ChatRoomEnterResponse = ChatRoomEnterApiResponse;

/**
 * 채팅방 생성 요청
 */
export interface CreateChatRoomRequest {
  partnerId: number; // 상대방 ID
}

/**
 * 채팅방 생성 응답
 */
export interface CreateChatRoomApiResponse {
  statusCode: number;
  message: string;
  data: number; // 생성된 채팅방 ID
}

export type CreateChatRoomResponse = CreateChatRoomApiResponse;

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
