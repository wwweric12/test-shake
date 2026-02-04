'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

import EmptyChatIcon from '@/assets/icon/chat-dashed.svg';
import { Badge } from '@/components/ui/Badge';
import { DSTI_CHARACTERS } from '@/constants/dsti';
import { useUnreadCount } from '@/services/chat/hooks';
import { ChatRoom } from '@/types/chat';
import { formatChatTime } from '@/utils/dateFormat';
interface RoomListProps {
  rooms: ChatRoom[]; // 채팅방 목록
  onSelectRoom: (room: ChatRoom) => void; // 채팅방 선택 콜백
  isLoading?: boolean; // 로딩 상태
  error?: boolean; // 에러 상태
}

/**
 * 채팅방 목록
 * 각 채팅방의 마지막 메시지, 시간, 읽지 않은 메시지 수 표시
 */
export function RoomList({ rooms, onSelectRoom, isLoading, error }: RoomListProps) {
  // 전체 읽지 않은 메시지 수 계산
  const { data: totalUnreadCount = 0 } = useUnreadCount();
  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">채팅방 목록을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">채팅방 목록을 불러올 수 없습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="bg-custom-white flex border-b px-4 py-3 shadow-sm">
        <h1 className="title2">채팅</h1>
        <div className="flex items-center px-2">
          {totalUnreadCount > 0 && (
            <Badge className="bg-custom-red flex h-5 min-w-5 items-center justify-center px-1 text-white">
              {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
            </Badge>
          )}
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div className="bg-custom-white flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          // 빈 상태
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <Image src={EmptyChatIcon} alt="빈 채팅" width={48} height={48} />
            <p className="mt-2">채팅방이 없습니다</p>
          </div>
        ) : (
          // 채팅방 목록
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
                  {/* 프로필 이미지 - null 처리 */}
                  {room.partnerProfileImage ? (
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={room.partnerProfileImage}
                        alt={`${room.partnerName || '상대방'} 프로필`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                      <Image
                        src={DSTI_CHARACTERS[room.partnerDsti]}
                        alt={`${room.partnerName || '상대방'} 프로필`}
                        fill
                        className="object-contain"
                        priority
                      />
                      {/* <span className="text-lg text-white">{room.partnerName?.[0] || '?'}</span> */}
                    </div>
                  )}

                  {/* 채팅 정보 - null 처리 */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="body1 truncate">{room.partnerName || '이름 없음'}</h3>
                    </div>
                    <p className="subhead3 mt-1 line-clamp-1 text-gray-600">
                      {room.lastMessage || '메시지 없음'}
                    </p>
                  </div>

                  {/* 나머지 코드 동일 */}
                  <div className="flex h-full flex-col items-end justify-between gap-1">
                    <span className="footnote text-gray-500">
                      {formatChatTime(room.lastMessageTime)}
                    </span>
                    {room.unreadCount > 0 && (
                      <Badge className="bg-custom-red flex h-5 min-w-5 items-center justify-center px-1 text-white">
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
