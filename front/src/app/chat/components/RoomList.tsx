'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

// import { MessageCircle, Users } from 'lucide-react';
import EmptyChatIcon from '@/assets/icon/chat-dashed.svg';

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
      <div className="bg-custom-white border-b px-4 py-3 shadow-sm">
        <h1 className="title2">채팅</h1>
      </div>

      <div className="bg-custom-white flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            {/* <MessageCircle size={48} className="mb-2" /> */}
            <Image src={EmptyChatIcon} alt="빈 채팅" />
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
                className="bg-custom-white w-full p-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="subhead1">{room.name}</h3>
                    <p className="footnote mt-1 line-clamp-1 text-gray-600">{room.lastMessage}</p>
                  </div>

                  <div className="footnote ml-3 flex flex-col items-end text-gray-500">
                    {/* <span>{formatTime(room.lastMessageAt)}</span> */}
                    <div className="flex items-center">
                      {/* <Users size={12} className="mr-1" /> */}
                      <span className="footnote flex h-5 w-5 items-center justify-center rounded-full bg-red-500 font-bold text-white">
                        {room.unreadCount}
                      </span>
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
