'use client';

import { useState } from 'react';
import Image from 'next/image';

import QuitIcon from '@/assets/icon/door-open.svg';

import { LeaveRoomModal } from './LeaveRoomModal';

export function LeaveRoomButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2">
        <Image src={QuitIcon} alt="방 나가기" width={20} height={20} />
      </button>

      {open && <LeaveRoomModal onClose={() => setOpen(false)} />}
    </>
  );
}
