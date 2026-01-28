'use client';

import { useEffect, useMemo } from 'react';

import { chatBus } from '@/app/chat/events/chatEventBus';
import { mapApiChatRoom } from '@/app/chat/services/chatMapper';
import { ChatRoom } from '@/app/chat/types/models';
import { useChatRooms as useChatRoomsQuery } from '@/services/chat/hooks';

interface RoomUpdateEvent {
  roomId: number;
  lastMessage: string;
}

export function useChatRooms() {
  const { data, isLoading, isError } = useChatRoomsQuery();

  // ✅ API → UI 모델 변환
  const rooms: ChatRoom[] = useMemo(() => {
    if (!data) return [];
    return data.data.map(mapApiChatRoom);
  }, [data]);

  // ✅ mitt로 마지막 메시지 갱신
  useEffect(() => {
    const handler = ({ roomId, lastMessage }: RoomUpdateEvent) => {
      // React Query 캐시 직접 건드리지 않고
      // UI state에서만 반영
      rooms.forEach((room) => {
        if (room.id === roomId) {
          room.lastMessage = lastMessage;
        }
      });
    };

    chatBus.on('roomUpdate', handler);
    return () => chatBus.off('roomUpdate', handler);
  }, [rooms]);

  return {
    rooms,
    isLoading,
    error: isError,
  };
}
