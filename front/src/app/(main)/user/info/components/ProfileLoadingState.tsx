'use client';

export function ProfileLoadingState() {
  return (
    <div className="bg-custom-white flex flex-1 flex-col items-center justify-center">
      <p className="body1 text-custom-purple animate-pulse font-medium">
        프로필을 불러오는 중입니다...
      </p>

      <div className="border-custom-purple mt-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}
