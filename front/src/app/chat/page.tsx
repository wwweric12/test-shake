'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import BottomNavigation from '@/components/common/BottomNavigation';
import { useChatRooms } from '@/services/chat/hooks';
import { ChatRoom } from '@/types/chat';

import { RoomList } from './components/RoomList';
import { ChatRoomContainer } from './containers/ChatRoomContainer';

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomIdParam = searchParams.get('room');

  const { data, isLoading, isError } = useChatRooms();

  // ✅ useMemo로 계산하여 불필요한 상태 제거
  const selectedRoom = useMemo(() => {
    if (!roomIdParam || !data?.data?.content) return null;
    return data.data.content.find((r) => r.chatRoomId === Number(roomIdParam)) || null;
  }, [roomIdParam, data]);

  const handleSelectRoom = (room: ChatRoom) => {
    router.push(`/chat?room=${room.chatRoomId}`, { scroll: false });
  };

  const handleBack = () => {
    router.push('/chat', { scroll: false });
  };

  if (!selectedRoom) {
    return (
      <div>
        <RoomList
          rooms={data?.data?.content ?? []}
          isLoading={isLoading}
          error={isError}
          onSelectRoom={handleSelectRoom}
        />
      </div>
    );
  }

  return <ChatRoomContainer roomId={selectedRoom.chatRoomId} onBack={handleBack} />;
}
