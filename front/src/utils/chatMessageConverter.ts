import {
  ChatMessage,
  ChatMessageWithProfile,
  PartnerInfo,
  ReceivedMessageData,
} from '@/types/chat';

// REST API 메시지를 UI용 메시지로 변환
// REST API는 isMine을 보내주지 않으므로 프론트에서 계산
export function convertApiMessageToProfile(
  msg: ChatMessage,
  currentUserId: number,
  partnerInfo?: PartnerInfo,
): ChatMessageWithProfile {
  const isMine = msg.senderId === currentUserId;
  const profileImage =
    partnerInfo?.partnerProfileImage && partnerInfo.partnerProfileImage.trim() !== ''
      ? partnerInfo.partnerProfileImage
      : undefined;
  return {
    ...msg,
    isMine,
    senderName: isMine ? undefined : partnerInfo?.partnerName,
    senderProfileImageUrl: isMine ? undefined : profileImage,
    dsti: partnerInfo?.partnerDsti || '',
  };
}

// WebSocket 메시지를 UI용 메시지로 변환
// 백엔드가 전달한 isMine 값을 그대로 사용
export function convertWsMessageToProfile(
  receivedData: ReceivedMessageData, // message + isMine을 함께 받음
): ChatMessageWithProfile {
  const { message, isMine } = receivedData;
  const profileImage =
    message.senderProfileImageUrl && message.senderProfileImageUrl.trim() !== ''
      ? message.senderProfileImageUrl
      : undefined;
  return {
    id: message.messageId,
    chatRoomId: message.chatRoomId,
    senderId: message.senderId,
    content: message.content,
    sentAt: message.sentAt,
    isRead: message.isRead,
    isMine, // 백엔드가 보낸 값 그대로 사용
    senderName: isMine ? undefined : message.senderName,
    senderProfileImageUrl: isMine ? undefined : profileImage,
    dsti: message.dsti || '',
  };
}
