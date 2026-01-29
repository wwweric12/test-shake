'use client';

import { ChatRoomView } from '@/app/chat/components/ChatRoomView';
import { useChatRoom } from '@/app/chat/hooks/useChatRoom';

interface ChatRoomContainerProps {
  roomId: number;
  roomName: string;
  onBack: () => void;
}

export function ChatRoomContainer({ roomId, roomName, onBack }: ChatRoomContainerProps) {
  const { messages, sendMessage, isLoading } = useChatRoom({ roomId });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">메시지 불러오는 중...</p>
      </div>
    );
  }

  return (
    <ChatRoomView roomName={roomName} messages={messages} onSend={sendMessage} onBack={onBack} />
  );
}
