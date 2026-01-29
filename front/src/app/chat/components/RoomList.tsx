'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

import EmptyChatIcon from '@/assets/icon/chat-dashed.svg';
import { Badge } from '@/components/ui/Badge';
import { ChatRoom } from '@/types/chat';

interface RoomListProps {
  rooms: ChatRoom[];
  onSelectRoom: (room: ChatRoom) => void;
  isLoading?: boolean;
  error?: boolean;
}

export function RoomList({ rooms, onSelectRoom, isLoading, error }: RoomListProps) {
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';

    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      // 24시간 이내면 시간만, 이후면 날짜 표시
      if (diffInHours < 24) {
        return date.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      }

      return date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
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
      <div className="bg-custom-white flex border-b px-4 py-3 shadow-sm">
        <h1 className="title2">채팅</h1>
        <div className="flex items-center px-2">
          <Badge className="bg-custom-red flex h-5 min-w-5 items-center justify-center px-0 text-white">
            1{/* TODO: 숫자 카운팅 */}
          </Badge>
        </div>
      </div>

      <div className="bg-custom-white flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <Image src={EmptyChatIcon} alt="빈 채팅" width={48} height={48} />
            <p className="mt-2">채팅방이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y">
            {rooms.map((room, index) => (
              <motion.button
                key={room.chatRoomId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectRoom(room)}
                className="bg-custom-white w-full p-4 text-left transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {/* 프로필 이미지 */}
                  {room.otherUserProfileImageUrl && (
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={room.otherUserProfileImageUrl}
                        alt={`${room.otherUserNickname} 프로필`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* 채팅 정보 */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="body1 truncate">{room.otherUserNickname}</h3>
                    </div>
                    <p className="subhead3 mt-1 line-clamp-1 text-gray-600">
                      {room.lastMessage || '메시지 없음'}
                    </p>
                  </div>
                  {/* 오른쪽 영역 (날짜 + 배지) */}
                  <div className="flex h-full flex-col items-end justify-between">
                    {/* 날짜 (위) */}
                    <span className="footnote text-gray-500">{formatTime(room.lastMessageAt)}</span>

                    {/* 읽지 않은 메시지 배지 (중앙/아래 쪽) */}
                    {room.unreadCount > 0 && (
                      <Badge className="bg-custom-red flex h-5 min-w-5 items-center justify-center px-0 text-white">
                        {room.unreadCount > 99 ? '99+' : room.unreadCount}
                      </Badge>
                    )}
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
