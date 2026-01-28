'use client';

import { useEffect, useState } from 'react';

import { chatBus } from '@/app/chat/events/chatEventBus';
import { fetchChatRooms } from '@/app/chat/services/chatRoomService';
import { ChatRoom } from '@/app/chat/types/models';

interface RoomUpdateEvent {
  roomId: number;
  lastMessage: string;
}

export function useChatRooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchChatRooms()
      .then(setRooms)
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handler = ({ roomId, lastMessage }: RoomUpdateEvent) => {
      setRooms((prev) =>
        prev.map((room) => (room.id === roomId ? { ...room, lastMessage } : room)),
      );
    };

    chatBus.on('roomUpdate', handler);
    return () => chatBus.off('roomUpdate', handler);
  }, []);

  return { rooms, isLoading, error };
}
