export const DSTI_INFO: Record<string, { label: string; desc: string }> = {
  P: { label: '판교형', desc: '“유저가 안 쓰면 의미 없잖아?”' },
  E: { label: '을지로형', desc: '“터지기 전에 미리 막아야지.”' },
  D: { label: 'DFS형', desc: '“이게 왜 돌아가는지 알아야 돼.”' },
  B: { label: 'BFS형', desc: '“빨리 써보고 결정하자!”' },
  A: { label: '애자일형', desc: '“일단 배포가 우선이야!!”' },
  W: { label: '워터풀형', desc: '“내 사전에 버그는 없다.”' },
  R: { label: 'Private형', desc: '“딥워크 중, 연락은 비동기로”' },
  U: { label: 'Public형', desc: '“지금 바로 논의 가능해요”' },
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
  intro: { index: 1, title: 'DSTI 분석' },
  main: { index: 2, title: 'DSTI 분석' },
  result: { index: 3, title: '분석 결과' },
} as const;
