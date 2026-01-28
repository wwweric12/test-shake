'use client';

import { ChatRoomView } from '@/app/chat/components/ChatRoomView';
import { useChatRoom } from '@/app/chat/hooks/useChatRoom';

interface ChatRoomContainerProps {
  roomId: number;
  roomName: string;
  onBack: () => void;
}

export function ChatRoomContainer({ roomId, roomName, onBack }: ChatRoomContainerProps) {
  const currentUserId = 'mock-user-1';

  const { messages, sendMessage } = useChatRoom({
    roomId,
    currentUserId,
  });

  return (
    <ChatRoomView roomName={roomName} messages={messages} onSend={sendMessage} onBack={onBack} />
  );
}
