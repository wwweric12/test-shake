import { StaticImageData } from 'next/image';

import EBAR from '@/assets/images/characters/EBAR.png';
import EBAU from '@/assets/images/characters/EBAU.png';
import EBWR from '@/assets/images/characters/EBWR.png';
import EBWU from '@/assets/images/characters/EBWU.png';
import EDAR from '@/assets/images/characters/EDAR.png';
import EDAU from '@/assets/images/characters/EDAU.png';
import EDWR from '@/assets/images/characters/EDWR.png';
import EDWU from '@/assets/images/characters/EDWU.png';
import PBAR from '@/assets/images/characters/PBAR.png';
import PBAU from '@/assets/images/characters/PBAU.png';
import PBWR from '@/assets/images/characters/PBWR.png';
import PBWU from '@/assets/images/characters/PBWU.png';
import PDAR from '@/assets/images/characters/PDAR.png';
import PDAU from '@/assets/images/characters/PDAU.png';
import PDWR from '@/assets/images/characters/PDWR.png';
import PDWU from '@/assets/images/characters/PDWU.png';

export const DSTI_CHARACTERS: Record<string, StaticImageData> = {
  PDAR,
  PDAU,
  PDWR,
  PDWU,
  PBAR,
  PBAU,
  PBWR,
  PBWU,
  EDAR,
  EDAU,
  EDWR,
  EDWU,
  EBAR,
  EBAU,
  EBWR,
  EBWU,
};

export const DSTI_INDICATORS = [
  { title: '서비스 지향성', label: 'Biz vs Core', types: ['P', 'E'] },
  { title: '학습 방식', label: 'Deep vs Wide', types: ['D', 'B'] },
  { title: '개발 스타일', label: 'Speed vs Quality', types: ['A', 'W'] },
  { title: '작업 환경', label: 'Private vs Public', types: ['R', 'U'] },
];

export const DSTI_INFO: Record<
  string,
  { label: string; copy: string; desc: string; tags: string[] }
> = {
  P: {
    label: '판교형',
    copy: '“유저가 안 쓰면 의미 없어.”',
    desc: '비즈니스의 임팩트와 유저의 반응에서 큰 보람을 느끼는군요!',
    tags: ['#User_Centric', '#Trendy_Stack'],
  },
  E: {
    label: '을지로형',
    copy: '“터지기 전에 미리 막자.”',
    desc: '트래픽을 견디는 견고한 코드와 시스템의 안정성을 신뢰하시네요!',
    tags: ['#Legacy_Optimization', '#Scalability'],
  },
  D: {
    label: 'DFS형',
    copy: '“이게 왜 돌아가는 걸까?”',
    desc: '내부 소스코드와 원리까지 파야 직성이 풀리는 분석가시네요!',
    tags: ['#Deep_Dive', '#Specialist'],
  },
  B: {
    label: 'BFS형',
    copy: '“빨리 써보고 결정하자!”',
    desc: '트렌디한 기술과 필요한 도구를 빠르게 찾는 데 능숙하시네요!',
    tags: ['#Fast_Learning', '#Generalist'],
  },
  A: {
    label: 'Agile형',
    copy: '“일단 배포가 우선이야!!”',
    desc: '배포하고 수정하며 유저의 반응을 확인하는 리듬을 즐기시는군요!',
    tags: ['#Fast_Delivery', '#MVP'],
  },
  W: {
    label: 'Waterfall형',
    copy: '“내 사전에 버그는 없다.”',
    desc: '미리 예외 상황을 완벽 차단하고 배포하고 싶어 하시네요!',
    tags: ['#Clean_Architecture', '#Test_Driven'],
  },
  R: {
    label: 'Private형',
    copy: '“지금은 딥워크 중.”',
    desc: '나만의 벙커에서 고도로 집중할 때 최고의 아웃풋이 나오시는군요!',
    tags: ['#Deep_Work', '#Home_Setup'],
  },
  U: {
    label: 'Public형',
    copy: '“바로 얘기해볼까요?”',
    desc: '즉각적인 소통과 협업을 통해 문제를 해결하는 스타일이시네요!',
    tags: ['#Face_to_Face', '#실시간_Sync'],
  },
};

export const DSTI_TITLES: Record<string, string> = {
  PDAR: '고독한 고수',
  PDAU: '토론하는 리더',
  PDWR: '완벽주의 설계자',
  PDWU: '팀의 나침반',
  PBAR: '해결사 엔진',
  PBAU: '올라운드 플레이어',
  PBWR: '침묵의 빌더',
  PBWU: '공감형 메이커',
  EDAR: '고독한 장인',
  EDAU: '기술 전도사',
  EDWR: '시스템 수호자',
  EDWU: '기술 사령관',
  EBAR: '단단한 파수꾼',
  EBAU: '협업 가디언',
  EBWR: '규칙 집착러',
  EBWU: '조화로운 매니저',
};

export const DSTI_STEP_INFO: Record<string, { index: number; title: string }> = {
  intro: { index: 1, title: '나의 개발 성향 알아보기' },
  main: { index: 2, title: 'DSTI 분석' },
  result: { index: 3, title: '나의 DSTI는?' },
} as const;

export const DSTI_QUESTIONS = [
  // Part 1: P vs E (서비스 지향성)
  {
    question: '새 프로젝트 투입! 🚀\n더 중요하게 생각하는 건?',
    options: [
      { label: '압도적 성장!\n비즈니스 임팩트가 우선이야!', value: 'P' },
      { label: '서버 터지면 잠 못 자요...\n안정성이 최고지', value: 'E' },
    ],
  },
  {
    question: '팀장님의 갑작스러운 요청!\n나의 첫 마디는? 💬',
    options: [
      { label: '어떤 지표를 위한 기능인가요?', value: 'P' },
      { label: '넵, 성능 저하 없이 구현해 놓을게요.', value: 'E' },
    ],
  },
  {
    question: '기술 스택을 결정할 때\n나만의 기준은? 🛠️',
    options: [
      { label: '요즘 제일 핫하고 배우고 싶은 기술', value: 'P' },
      { label: '이미 검증됐고 자신 있는 기술', value: 'E' },
    ],
  },
  // Part 2: D vs B (학습 방식)
  {
    question: '새로운 프레임워크 등장! ✨\n나의 공부 스타일은?',
    options: [
      { label: '내부 원리까지 파야 마음이 편해.', value: 'D' },
      { label: '일단 써보면서 익히는 게 빠르지!', value: 'B' },
    ],
  },
  {
    question: '기술 블로그를 쓰자.\n어떤 글을 써볼까? ✍️',
    options: [
      { label: '성능 튜닝과 병목 분석!\n딥한 트러블 슈팅 기록', value: 'D' },
      { label: '이 기술로 이거 만들었다!\n실전 활용과 개발 후기', value: 'B' },
    ],
  },
  {
    question: '원인 불명의 에러 발생! 😱\n어떻게 해결할까?',
    options: [
      { label: '로그 타고 끝까지 간다.\n근본 원인 잡을 때까지!', value: 'D' },
      { label: 'AI 활용 능력이 중요해.\n빠르게 고쳐보자!', value: 'B' },
    ],
  },
  // Part 3: A vs W (개발 스타일)
  {
    question: '런칭까지 단 3주! ⏰\n나의 개발 전략은?',
    options: [
      { label: '일단 굴러가게 만들고,\n리팩토링은 내일의 나에게!', value: 'A' },
      { label: '첫 단추부터 꼼꼼히!\n예외 상황은 애초에 차단한다', value: 'W' },
    ],
  },
  {
    question: '팀장님의 코드 리뷰! 👀\n더 좋은 의견을 주셨다면?',
    options: [
      { label: '좋은데요? 바로 수정해서 올릴게요!', value: 'A' },
      { label: '좋아요. 다음 단계에 검토할게요.', value: 'W' },
    ],
  },
  {
    question: '지긋지긋한 문서화... 📝\n나는 어떤 스타일?',
    options: [
      { label: '개발하며 바뀔 때마다 수시 업데이트', value: 'A' },
      { label: '모든 기능 확정 후 완벽 정리 후 배포', value: 'W' },
    ],
  },
  // Part 4: R vs U (작업 환경)
  {
    question: '업무 중 막혔을 때 🚧\n선호하는 탈출법은?',
    options: [
      { label: '이어폰 꼽고 혼자 집중해서 찾는다', value: 'R' },
      { label: '화이트보드 앞으로! 팀원들과 같이!', value: 'U' },
    ],
  },
  {
    question: '내가 가장 선호하는\n팀 소통 방식은? 🗣️',
    options: [
      { label: '슬랙/노션에 기록되는\n투명한 비동기 소통', value: 'R' },
      { label: '직접 대화로 슥슥!\n빠르게 결정하고 핵심만 공유', value: 'U' },
    ],
  },
  {
    question: '팀 회의실 입장! 🪑\n나는 어디에 앉을까?',
    options: [
      { label: '가장자리 상석.\n전체 흐름을 보며 조용히 상황 파악!', value: 'R' },
      { label: '모두와 눈 마주치는 정중앙.\n적극적으로 티키타카!', value: 'U' },
    ],
  },
];
