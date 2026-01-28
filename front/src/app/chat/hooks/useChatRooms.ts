'use client';

import { useEffect, useState } from 'react';

import { chatBus } from '@/app/chat/events/chatBus';
import { fetchChatRooms } from '@/app/chat/services/chatRoomService';
import { ChatRoom } from '@/app/chat/types/models';

export function useChatRooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  useEffect(() => {
    fetchChatRooms().then(setRooms);
  }, []);

  useEffect(() => {
    const handler = ({ roomId, lastMessage }: any) => {
      setRooms((prev) =>
        prev.map((room) => (room.id === roomId ? { ...room, lastMessage } : room)),
      );
    };

    chatBus.on('roomUpdate', handler);
    return () => chatBus.off('roomUpdate', handler);
  }, []);

  return {
    rooms,
    selectedRoomId,
    selectRoom: setSelectedRoomId,
  };
}
