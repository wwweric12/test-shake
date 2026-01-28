'use client';

import { ChatRoomView } from '@/app/chat/components/ChatRoomView';
import { useChatRoom } from '@/app/chat/hooks/useChatRoom';
import { ChatMessage } from '@/app/chat/types/models';

interface ChatRoomContainerProps {
  roomId: number;
}

export function ChatRoomContainer({ roomId }: ChatRoomContainerProps) {
  // 임시 사용자 (나중에 auth로 교체)
  const currentUserId = 'mock-user-1';

  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      roomId,
      senderId: 'other-user',
      content: '안녕하세요!',
      createdAt: new Date().toISOString(),
      isMine: false,
    },
  ];

  const { messages, sendMessage } = useChatRoom({
    roomId,
    currentUserId,
    initialMessages,
  });

  return <ChatRoomView messages={messages} onSend={sendMessage} />;
}
