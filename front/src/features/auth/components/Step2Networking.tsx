import backIcon from '@/assets/icon/back.svg';

export default function Step2Networking({ data, onNext, onPrev }: any) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">2단계: 네트워킹 정보</h2>
      <div className="flex gap-2">
        <button onClick={onPrev} className="flex-1 rounded-lg bg-gray-200 py-3">
          이전으로
        </button>
        <button
          onClick={() => onNext({ introduction: '반갑습니다!' })}
          className="flex-2 rounded-lg bg-blue-500 px-8 py-3 font-bold text-white"
        >
          다음으로 (3단계 이동)
        </button>
      </div>
    </div>
  );
}
