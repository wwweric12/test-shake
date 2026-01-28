'use client';

import { useState } from 'react';

import { ChatRoomView } from '@/app/chat/components/ChatRoomView';
import { RoomList } from '@/app/chat/components/RoomList';
import { useChatRealtime } from '@/app/chat/hooks/useChatRealtime';
import type { ChatRoom } from '@/app/chat/types/models';

/**
 * ⚠️ 임시 더미 데이터
 * → 나중에 REST API 훅으로 교체
 */
const MOCK_ROOMS: ChatRoom[] = [
  {
    id: 1,
    name: '홍길동',
    lastMessage: '안녕하세요!',
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
  },
];

const CURRENT_USER_ID = 'user-1';

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  // 방 선택 시에만 실시간 훅 활성화
  const { messages, sendMessage } = useChatRealtime({
    roomId: selectedRoom?.id ?? 0,
    currentUserId: CURRENT_USER_ID,
    initialMessages: [],
  });

  // ✅ 채팅방 목록 화면
  if (!selectedRoom) {
    return <RoomList rooms={MOCK_ROOMS} onSelectRoom={setSelectedRoom} />;
  }

  // ✅ 채팅방 화면
  return (
    <div className="flex h-screen flex-col">
      {/* 상단 헤더 */}
      <div className="flex items-center border-b p-4">
        <button onClick={() => setSelectedRoom(null)} className="mr-3 text-sm text-blue-500">
          ← 뒤로
        </button>
        <h2 className="font-semibold">{selectedRoom.name}</h2>
      </div>

      {/* 채팅 뷰 */}
      <ChatRoomView messages={messages} onSend={sendMessage} />
    </div>
  );
}
