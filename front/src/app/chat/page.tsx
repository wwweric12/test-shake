'use client';

import { useState } from 'react';

import { RoomList } from '@/app/chat/components/RoomList';
import { ChatRoomContainer } from '@/app/chat/containers/ChatRoomContainer';
import BottomNavigation from '@/components/common/BottomNavigation';
import { useChatRooms } from '@/services/chat/hooks';
import { ChatRoom } from '@/types/chat';

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  const { data, isLoading, isError } = useChatRooms();

  if (!selectedRoom) {
    return (
      <div>
        <RoomList
          rooms={data?.data ?? []}
          isLoading={isLoading}
          error={isError}
          onSelectRoom={setSelectedRoom}
        />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <ChatRoomContainer
      roomId={selectedRoom.chatRoomId}
      roomName={selectedRoom.otherUserNickname}
      onBack={() => setSelectedRoom(null)}
    />
  );
}
