'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users } from 'lucide-react';

import { useChatRooms } from '@/services/chat/hooks';

import type { WSChatRoom } from '../types';

interface RoomListProps {
  onSelectRoom: (room: WSChatRoom) => void;
}

export function RoomList({ onSelectRoom }: RoomListProps) {
  // ✅ 팀 공통 패턴 사용: React Query 훅
  const { data: rooms, isLoading, error } = useChatRooms();

  const formatTime = (timestamp?: string | number | null) => {
    if (!timestamp) return '';

    const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;

    return date.toLocaleDateString('ko-KR');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">채팅방 목록 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">채팅방 목록을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="border-b bg-white px-4 py-3 shadow-sm">
        <h1 className="text-xl font-bold">채팅</h1>
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-y-auto">
        {rooms && rooms.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <MessageCircle size={48} className="mb-2" />
            <p>채팅방이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y">
            {rooms?.map((room: WSChatRoom, index: number) => (
              <motion.button
                key={room.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectRoom(room)}
                className="w-full bg-white p-4 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{room.name}</h3>
                    {room.lastMessage && (
                      <p className="mt-1 line-clamp-1 text-sm text-gray-600">{room.lastMessage}</p>
                    )}
                  </div>
                  <div className="ml-3 flex flex-col items-end">
                    <span className="text-xs text-gray-400">
                      {formatTime(room.lastMessageTime)}
                    </span>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <Users size={12} className="mr-1" />
                      {room.participantCount}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
