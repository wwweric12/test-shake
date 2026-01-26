export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold">채팅 앱</h1>
        <a
          href="/chat"
          className="inline-block rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
        >
          채팅 시작하기 →
        </a>
      </div>
    </div>
  );
}
