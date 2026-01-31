'use client';

import { useChatRooms } from '@/services/chat/hooks';
// import { useUserProfile } from '@/services/user/hooks'; 인증로직
import { getErrorMessage } from '@/utils/error';

import { ChatRoomView } from '../components/ChatRoomView';
import { useChatRoom } from '../hooks/useChatRoom';

interface ChatRoomContainerProps {
  roomId: number;
  onBack: () => void;
}

export function ChatRoomContainer({ roomId, onBack }: ChatRoomContainerProps) {
  // 현재 로그인한 사용자 정보 조회 (기존 Hook 재사용)
  // const { data: userInfoData, isLoading: isLoadingUser, error: userError } = useUserProfile();
  // const currentUserId = userInfoData?.data?.userId;
  const currentUserId = 1;

  // 채팅방 목록에서 현재 채팅방 정보 찾기 (파트너 정보 추출)
  const { data: roomsData } = useChatRooms();
  const currentRoom = roomsData?.data?.content?.find((room) => room.chatRoomId === roomId);

  // 채팅방 Hook
  const {
    messages,
    sendMessage,
    isLoading,
    isConnected,
    connectionStatus,
    error: chatError,
    loadPreviousMessages,
  } = useChatRoom({
    roomId,
    currentUserId: currentUserId || 0, // fallback
    partnerInfo: currentRoom
      ? {
          partnerId: currentRoom.partnerId,
          partnerName: currentRoom.partnerName,
          partnerProfileImage: currentRoom.partnerProfileImage,
        }
      : undefined,
    enabled: !!currentUserId && !!roomId, // 사용자 정보와 roomId가 있을 때만 활성화
  });

  // 인증 로직 401에러로 잠시 숨겨둠
  // // 사용자 정보 로딩 중
  // if (isLoadingUser) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <p className="text-gray-500">사용자 정보를 불러오는 중...</p>
  //     </div>
  //   );
  // }

  // // 사용자 정보 에러 (로그인 안 됨 또는 인증 실패)
  // if (userError || !currentUserId) {
  //   return (
  //     <div className="flex h-screen flex-col items-center justify-center gap-4">
  //       <p className="text-red-500">로그인이 필요합니다.</p>
  //       {userError && (
  //         <p className="text-xs text-gray-500">
  //           {getErrorMessage(userError, '사용자 정보를 불러올 수 없습니다.')}
  //         </p>
  //       )}
  //       <button
  //         onClick={() => (window.location.href = '/login')}
  //         className="bg-custom-purple rounded-md px-4 py-2 text-white"
  //       >
  //         로그인하러 가기
  //       </button>
  //     </div>
  //   );
  // }

  // 채팅 메시지 로딩 중
  if (isLoading && messages.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">메시지를 불러오는 중...</p>
          <p className="mt-2 text-xs text-gray-400">채팅방 ID: {roomId}</p>
        </div>
      </div>
    );
  }

  // 채팅방 정보 없음
  if (!currentRoom && !isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500">채팅방을 찾을 수 없습니다.</p>
        <button onClick={onBack} className="bg-custom-purple rounded-md px-4 py-2 text-white">
          채팅 목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 채팅방 에러
  if (chatError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">채팅방을 불러오는데 실패했습니다.</p>
        <p className="text-xs text-gray-500">
          {getErrorMessage(chatError, '채팅방 연결에 실패했습니다.')}
        </p>
        <button onClick={onBack} className="bg-custom-purple rounded-md px-4 py-2 text-white">
          채팅 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* WebSocket 연결 실패 알림 */}
      {!isConnected && connectionStatus === 'ERROR' && (
        <div className="border-b border-yellow-300 bg-yellow-100 px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">⚠️ 실시간 연결 실패</p>
              <p className="mt-0.5 text-xs text-yellow-600">
                이전 메시지는 볼 수 있지만, 새 메시지 전송이 불가능합니다
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-yellow-200 px-3 py-1 text-xs text-yellow-800 hover:bg-yellow-300"
            >
              새로고침
            </button>
          </div>
        </div>
      )}

      <ChatRoomView
        roomId={roomId}
        roomName={currentRoom?.partnerName || '채팅방'}
        messages={messages}
        onSend={sendMessage}
        onLoadPrevious={loadPreviousMessages}
        onBack={onBack}
        isConnected={isConnected}
        connectionStatus={connectionStatus}
      />
    </div>
  );
}
