'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useChatRooms } from '@/services/chat/hooks';

import { ChatRoomView } from '../components/ChatRoomView';
import { useChatRoom } from '../hooks/useChatRoom';

interface ChatRoomContainerProps {
  roomId: number;
  onBack: () => void;
}

export function ChatRoomContainer({ roomId, onBack }: ChatRoomContainerProps) {
  const router = useRouter();
  const { data: roomsData } = useChatRooms();

  const currentRoom = roomsData?.data?.content?.find((room) => room.chatRoomId === roomId);

  const {
    messages,
    sendMessage,
    isLoading,
    isConnected,
    connectionStatus,
    error: chatError,
    loadPreviousMessages,
    currentUserId,
    messageError,
    clearMessageError,
    partnerLeft,
  } = useChatRoom({
    roomId,
    partnerInfo: currentRoom
      ? {
          partnerId: currentRoom.partnerId,
          partnerName: currentRoom.partnerName,
          partnerProfileImage: currentRoom.partnerProfileImage,
          partnerDsti: currentRoom.partnerDsti,
        }
      : undefined,
    enabled: !!roomId,
  });

  useEffect(() => {
    if (roomId) {
      router.push(`/chat?room=${roomId}`, { scroll: false });
    }
  }, [roomId, router]);

  if (!currentRoom && !isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500">채팅방을 찾을 수 없습니다.</p>
        <button onClick={onBack} className="bg-custom-purple rounded-md px-4 py-2 text-white">
          채팅 목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (chatError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">채팅방을 불러오는데 실패했습니다.</p>
        <p className="text-sm text-gray-600">{chatError.message}</p>
        <button onClick={onBack} className="bg-custom-purple rounded-md px-4 py-2 text-white">
          채팅 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <ChatRoomView
      roomId={roomId}
      reporteeId={currentRoom!.partnerId}
      roomName={currentRoom?.partnerName || '채팅방'}
      messages={messages}
      onSend={sendMessage}
      onLoadPrevious={loadPreviousMessages}
      onBack={onBack}
      isConnected={isConnected}
      connectionStatus={connectionStatus}
      messageError={messageError}
      onClearMessageError={clearMessageError}
      canSendMessage={!partnerLeft && (currentRoom?.canSendMessage ?? true)}
    />
  );
}
