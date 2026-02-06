'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { DSTI_CHARACTERS, DSTI_TITLES } from '@/constants/dsti';

export default function DstiTypeList() {
  const router = useRouter();
  const allTypes = Object.keys(DSTI_CHARACTERS);

  return (
    <div className="grid grid-cols-2 gap-3">
      {allTypes.map((type) => (
        <button
          key={type}
          onClick={() => router.push(`/dsti?type=${type.toLowerCase()}`)}
          className="flex flex-col items-center rounded-2xl bg-white p-5 shadow-sm transition-transform active:scale-95"
        >
          <div className="border-custom-purple bg-custom-deepgray/5 relative mb-3 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2">
            <Image src={DSTI_CHARACTERS[type]} alt={type} fill className="object-contain" />
          </div>
          <p className="title2 text-bold text-custom-blue">{type}</p>
          <p className="body2 text-custom-deepgray text-center break-keep">{DSTI_TITLES[type]}</p>
        </button>
      ))}
    </div>
  );
}
