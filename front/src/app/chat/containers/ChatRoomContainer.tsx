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
  const currentUserId = 1; // TODO: 실제 사용자 ID로 교체

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
  } = useChatRoom({
    roomId,
    currentUserId: currentUserId || 0,
    partnerInfo: currentRoom
      ? {
          partnerId: currentRoom.partnerId,
          partnerName: currentRoom.partnerName,
          partnerProfileImage: currentRoom.partnerProfileImage,
        }
      : undefined,
    enabled: !!currentUserId && !!roomId,
  });

  // URL 업데이트
  useEffect(() => {
    if (roomId) {
      router.push(`/chat?room=${roomId}`, { scroll: false });
    }
  }, [roomId, router]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">메시지를 불러오는 중...</p>
      </div>
    );
  }

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
        <button onClick={onBack} className="bg-custom-purple rounded-md px-4 py-2 text-white">
          채팅 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {!isConnected && connectionStatus === 'ERROR' && (
        <div className="border-b border-yellow-300 bg-yellow-100 px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">⚠️ 실시간 연결 실패</p>
              <p className="mt-0.5 text-xs text-yellow-600">
                이전 메시지는 볼 수 있지만, 새 메시지 전송이 불가능합니다
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-yellow-200 px-3 py-1 text-xs text-yellow-800 hover:bg-yellow-300"
            >
              새로고침
            </button>
          </div>
        </div>
      )}

      <ChatRoomView
        roomId={roomId}
        roomName={currentRoom?.partnerName || '채팅방'}
        messages={messages}
        onSend={sendMessage}
        onLoadPrevious={loadPreviousMessages}
        onBack={onBack}
        isConnected={isConnected}
        connectionStatus={connectionStatus}
      />
    </div>
  );
}
