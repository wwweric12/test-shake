import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <h1>내 모바일 테스트 페이지</h1>

      <Link href="/home">홈으로</Link>
      <br />
      <Link href="/chat">챗</Link>
      <br />
      <Link href="/login">login</Link>
      <br />
    </div>
  );
}
