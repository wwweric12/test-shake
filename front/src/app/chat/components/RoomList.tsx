'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users } from 'lucide-react';

import type { ChatRoom } from '../types/models';

interface RoomListProps {
  rooms: ChatRoom[];
  onSelectRoom: (room: ChatRoom) => void;
  isLoading?: boolean;
  error?: boolean;
}

export function RoomList({ rooms, onSelectRoom, isLoading, error }: RoomListProps) {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
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
      <div className="border-b bg-white px-4 py-3 shadow-sm">
        <h1 className="text-xl font-bold">채팅</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <MessageCircle size={48} className="mb-2" />
            <p>채팅방이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y">
            {rooms.map((room, index) => (
              <motion.button
                key={room.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectRoom(room)}
                className="w-full bg-white p-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{room.name}</h3>
                    <p className="mt-1 line-clamp-1 text-sm text-gray-600">{room.lastMessage}</p>
                  </div>

                  <div className="ml-3 flex flex-col items-end text-xs text-gray-500">
                    <span>{formatTime(room.lastMessageAt)}</span>
                    <div className="mt-1 flex items-center">
                      <Users size={12} className="mr-1" />
                      {room.unreadCount}
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
