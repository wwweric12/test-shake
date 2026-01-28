// // ===================================
// // src/features/chat/types/converters.ts
// // REST API ↔ WebSocket 타입 변환 유틸
// // (통신 보호 레이어)
// // ===================================

// import type { ChatMessage as ApiChatMessage, ChatRoom as ApiChatRoom } from '@/types/chat';

// import type { WSChatRoom, WSMessage } from './realtime';

// /**
//  * REST API 채팅방 → WebSocket 채팅방 타입
//  * - 서버 ↔ 서버 / 서버 ↔ 소켓 통신 기준
//  * - UI 요구사항 절대 반영하지 않음
//  */
// export function apiRoomToWSRoom(apiRoom: ApiChatRoom): WSChatRoom {
//   return {
//     id: String(apiRoom.chatRoomId),
//     name: apiRoom.otherUserNickname,
//     participantCount: 2, // 1:1 채팅 고정 (정책값)
//     lastMessage: apiRoom.lastMessage,
//     lastMessageTime: apiRoom.lastMessageAt, // ISO 8601 그대로
//   };
// }

// /**
//  * REST API 메시지 → WebSocket 메시지 타입
//  *
//  * ⚠️ 주의
//  * - API 응답에 senderId / senderName 없음
//  * - 실시간 서버(Spring WS)에서는 반드시 내려줘야 함
//  */
// export function apiMessageToWSMessage(apiMsg: ApiChatMessage, roomId: number): WSMessage {
//   return {
//     id: `${roomId}-${apiMsg.sendTime}`, // 임시 식별자 (서버 연결 시 교체)
//     roomId: String(roomId),
//     senderId: 'unknown', // ❗ 백엔드 WS에서 필수로 내려줄 값
//     senderName: 'Unknown',
//     content: String(apiMsg.content),
//     timestamp: apiMsg.sendTime,
//   };
// }

// /**
//  * WebSocket 메시지 → UI 친화 정보 보강
//  * ⚠️ 변환이 아니라 "판별"에 가깝기 때문에
//  * 통신 타입은 유지하고 속성만 덧붙임
//  */
// export function markOwnMessage(
//   wsMsg: WSMessage,
//   currentUserId: string,
// ): WSMessage & { isOwn: boolean } {
//   return {
//     ...wsMsg,
//     isOwn: wsMsg.senderId === currentUserId,
//   };
// }
