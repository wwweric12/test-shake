// 'use client';

// import { Button } from '@/components/ui/Button';

// interface LeaveRoomModalProps {
//   onClose: () => void;
// }

// export function LeaveRoomModal({ onClose }: LeaveRoomModalProps) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="w-[340px] rounded-lg bg-white p-5">
//         <h3 className="title4 mb-3 font-semibold">채팅방 나가기</h3>

//         <p className="subhead3 text-gray-600">
//           채팅방을 나가면 대화 내용은 복구할 수 없습니다.
//           <br />
//           정말 나가시겠습니까?
//         </p>

//         <div className="mt-4 flex justify-end gap-2">
//           <Button variant="ghost" onClick={onClose}>
//             취소
//           </Button>
//           <Button
//             className="bg-custom-red"
//             onClick={() => {
//               // TODO: 방 나가기 API + 라우팅
//               onClose();
//             }}
//           >
//             나가기
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
/**
 * 채팅방 나가기 확인 모달
 */

'use client';

import { useState } from 'react';

import { useExitChatRoomMutation } from '@/services/chat/hooks';
import { getErrorMessage } from '@/utils/error';

interface LeaveRoomModalProps {
  roomId: number; // 채팅방 ID
  onClose: () => void; // 모달 닫기 콜백
  onSuccess?: () => void; // 나가기 성공 콜백
}

/**
 * 채팅방 나가기 확인 모달
 * 나가기 확인 및 API 호출
 */
export function LeaveRoomModal({ roomId, onClose, onSuccess }: LeaveRoomModalProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const exitMutation = useExitChatRoomMutation();

  /**
   * 채팅방 나가기 처리
   */
  const handleLeave = async () => {
    if (isLeaving) return;

    try {
      setIsLeaving(true);

      // API 호출: DELETE /chat/rooms/{chatRoomId}/exit
      await exitMutation.mutateAsync(roomId);

      console.log(`[LeaveRoomModal] 채팅방 ${roomId} 나가기 성공`);

      // 성공 콜백
      onSuccess?.();
    } catch (error) {
      console.error('[LeaveRoomModal] 채팅방 나가기 실패:', error);
      const message = getErrorMessage(error, '채팅방 나가기에 실패했습니다.');
      alert(message);
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-2 text-lg font-semibold">채팅방 나가기</h3>
        <p className="mb-6 text-gray-600">
          채팅방을 나가시겠습니까?
          <br />
          나가면 대화 내역이 모두 삭제됩니다.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isLeaving}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleLeave}
            disabled={isLeaving}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {isLeaving ? '나가는 중...' : '나가기'}
          </button>
        </div>
      </div>
    </div>
  );
}
