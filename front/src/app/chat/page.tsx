'use client';

import { useState } from 'react';

import { RoomList } from '@/app/chat/components/RoomList';
import { ChatRoomContainer } from '@/app/chat/containers/ChatRoomContainer';
import { useChatRooms } from '@/app/chat/hooks/useChatRooms';
import type { ChatRoom } from '@/app/chat/types/models';

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const { rooms, isLoading, error } = useChatRooms();

  if (!selectedRoom) {
    return (
      <RoomList rooms={rooms} isLoading={isLoading} error={error} onSelectRoom={setSelectedRoom} />
    );
  }

  return (
    <ChatRoomContainer
      roomId={selectedRoom.id}
      roomName={selectedRoom.name}
      onBack={() => setSelectedRoom(null)}
    />
  );
}
