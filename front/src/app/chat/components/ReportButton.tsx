'use client';

import { useState } from 'react';
import Image from 'next/image';

import SirenIcon from '@/assets/icon/siren.svg';

import { ReportModal } from './ReportModal';

export function ReportButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2">
        <Image src={SirenIcon} alt="신고하기" width={20} height={20} />
      </button>

      {open && <ReportModal onClose={() => setOpen(false)} />}
    </>
  );
}
