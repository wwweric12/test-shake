'use client';

import { useState } from 'react';

import { ChatRoom } from '@/features/chat/components/ChatRoom';
import { RoomList } from '@/features/chat/components/RoomList';
import type { WSChatRoom as ChatRoomType } from '@/features/chat/types';

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomType | null>(null);

  return (
    <>
      {!selectedRoom ? (
        // ✅ 채팅방 목록 (HTTP로 로드)
        <RoomList onSelectRoom={setSelectedRoom} />
      ) : (
        // ✅ 채팅방 (과거 메시지는 HTTP, 실시간은 WebSocket)
        <ChatRoom
          roomId={selectedRoom.id}
          roomName={selectedRoom.name}
          onBack={() => setSelectedRoom(null)}
        />
      )}
    </>
  );
}
