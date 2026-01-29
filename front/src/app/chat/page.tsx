// 'use client';

// import { useState } from 'react';

// import { RoomList } from '@/app/chat/components/RoomList';
// import { ChatRoomContainer } from '@/app/chat/containers/ChatRoomContainer';
// import BottomNavigation from '@/components/common/BottomNavigation';
// import { useChatRooms } from '@/services/chat/hooks';
// import { ChatRoom } from '@/types/chat';

// export default function ChatPage() {
//   const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

//   const { data, isLoading, isError } = useChatRooms();

//   if (!selectedRoom) {
//     return (
//       <div>
//         <RoomList
//           rooms={data?.data ?? []}
//           isLoading={isLoading}
//           error={isError}
//           onSelectRoom={setSelectedRoom}
//         />
//         <BottomNavigation />
//       </div>
//     );
//   }

//   return (
//     <ChatRoomContainer
//       roomId={selectedRoom.chatRoomId}
//       roomName={selectedRoom.otherUserNickname}
//       onBack={() => setSelectedRoom(null)}
//     />
//   );
// }
/**
 * 채팅 페이지
 *
 * 채팅방 목록과 채팅방 화면을 전환하는 메인 페이지
 */

'use client';

import { useState } from 'react';

import { RoomList } from '@/app/chat/components/RoomList';
import { ChatRoomContainer } from '@/app/chat/containers/ChatRoomContainer';
import BottomNavigation from '@/components/common/BottomNavigation';
import { useChatRooms } from '@/services/chat/hooks';
import { ChatRoom } from '@/types/chat';

/**
 * 채팅 페이지
 *
 * 상태에 따라 채팅방 목록 또는 채팅방 화면을 표시
 */
export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  // 채팅방 목록 조회
  const { data, isLoading, isError } = useChatRooms();

  // 채팅방 선택되지 않음 -> 채팅방 목록 표시
  if (!selectedRoom) {
    return (
      <div>
        <RoomList
          rooms={data?.data?.content ?? []}
          isLoading={isLoading}
          error={isError}
          onSelectRoom={setSelectedRoom}
        />
        <BottomNavigation />
      </div>
    );
  }

  // 채팅방 선택됨 -> 채팅방 화면 표시
  return (
    <ChatRoomContainer
      roomId={selectedRoom.chatRoomId}
      roomName={selectedRoom.partnerName}
      onBack={() => setSelectedRoom(null)}
    />
  );
}
