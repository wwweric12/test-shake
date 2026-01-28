'use client';

import { Button } from '@/components/ui/Button';

interface LeaveRoomModalProps {
  onClose: () => void;
}

export function LeaveRoomModal({ onClose }: LeaveRoomModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[340px] rounded-lg bg-white p-5">
        <h3 className="title4 mb-3 font-semibold">채팅방 나가기</h3>

        <p className="subhead3 text-gray-600">
          채팅방을 나가면 대화 내용은 복구할 수 없습니다.
          <br />
          정말 나가시겠습니까?
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button
            className="bg-custom-red"
            onClick={() => {
              // TODO: 방 나가기 API + 라우팅
              onClose();
            }}
          >
            나가기
          </Button>
        </div>
      </div>
    </div>
  );
}
