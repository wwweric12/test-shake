import backIcon from '@/assets/icon/back.svg';

export default function Step3DSTI({ onNext, onPrev }: any) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">3단계: DSTI 테스트</h2>
      <p>성향 테스트 질문들이 여기에 나옵니다.</p>
      <div className="flex gap-2">
        <button onClick={onPrev} className="flex-1 rounded-lg bg-gray-200 py-3">
          이전으로
        </button>
        <button
          onClick={onNext}
          className="flex-2 rounded-lg bg-green-500 px-8 py-3 font-bold text-white"
        >
          가입 완료
        </button>
      </div>
    </div>
  );
}
