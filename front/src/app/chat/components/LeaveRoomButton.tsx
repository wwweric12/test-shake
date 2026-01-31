'use client';

import { useState } from 'react';
import Image from 'next/image';

import QuitIcon from '@/assets/icon/door-open.svg';

import { LeaveRoomModal } from './LeaveRoomModal';

interface LeaveRoomButtonProps {
  roomId: number; // 채팅방 ID
  onLeave?: () => void; // 나가기 성공 시 콜백
}

/**
 * 채팅방 나가기 버튼
 * 모달 열기 트리거
 */
export function LeaveRoomButton({ roomId, onLeave }: LeaveRoomButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2" aria-label="방 나가기">
        <Image src={QuitIcon} alt="방 나가기" width={20} height={20} />
      </button>

      {open && (
        <LeaveRoomModal
          roomId={roomId}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            onLeave?.();
          }}
        />
      )}
    </>
  );
}
