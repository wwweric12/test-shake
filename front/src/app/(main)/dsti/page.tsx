'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import DstiHeader from '@/app/(main)/dsti/components/DstiHeader';
import DstiTypeList from '@/app/(main)/dsti/components/DstiTypeList';
import DstiResult from '@/app/(main)/survey/dsti/components/DstiResult';
import backIcon from '@/assets/icon/back.svg';

export default function DstiPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeParam = searchParams.get('type')?.toUpperCase();

  return (
    <div className="min-h-screen">
      {typeParam ? (
        <header className="bg-custom-white flex h-14 items-center px-5">
          <button
            onClick={() => router.push('/dsti')}
            className="flex h-6 w-6 items-center justify-center transition-opacity hover:opacity-70"
          >
            <Image src={backIcon} alt="뒤로가기" />
          </button>
        </header>
      ) : (
        <DstiHeader />
      )}

      <main className={`px-5 pb-10 ${typeParam ? 'pt-0' : 'pt-[80px]'}`}>
        {typeParam ? <DstiResult resultType={typeParam} isReadOnly={true} /> : <DstiTypeList />}
      </main>
    </div>
  );
}
