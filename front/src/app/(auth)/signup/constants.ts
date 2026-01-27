import { Career, Network, UserProfile } from '@/types/user';

export const INITIAL_SIGNUP_DATA: UserProfile = {
  nickname: '',
  profileImageUrl: '',
  experience: null as unknown as boolean,
  career: '' as Career,
  dsti: 'NONE',
  positions: [],
  techSkills: [],
  networks: [],
  githubId: '',
  selfIntro: '',
};

export const STEP_INFO = {
  step1: { index: 1, title: '기본 프로필 정보' },
  step2: { index: 2, title: '네트워킹 정보' },
  step3: { index: 3, title: 'DSTI 성향 테스트' },
  step4: { index: 4, title: '가입 완료' },
} as const;

export const SIGNUP_MESSAGES = {
  NICKNAME_GUIDE: '※ 한 번 생성한 닉네임은 수정할 수 없습니다. (2~10자, 공백 불가)',
  ERROR_NICKNAME_LENGTH: '닉네임은 2자 이상 입력해주세요.',
  ERROR_CHECK_REQUIRED: '닉네임 중복 확인이 필요합니다.',
  ERROR_EXPERIENCE_REQUIRED: '실무 개발 경험 여부를 선택해주세요.',
  ERROR_CAREER_REQUIRED: '현재 상태를 선택해주세요.',
  SUCCESS_NICKNAME: '사용 가능한 닉네임입니다.',
  ERROR_NETWORKS_REQUIRED: '네트워킹 목적을 최소 하나 선택해주세요.',
  ERROR_GITHUB_REQUIRED: 'Github 아이디를 입력해주세요.',
  ERROR_INTRO_REQUIRED: '자기소개를 입력해주세요.',
} as const;

export const EXPERIENCE_LIST = [
  { label: '경험 있음', value: true },
  { label: '경험 없음', value: false },
] as const;

export const CAREER_LIST: { label: string; value: Career }[] = [
  { label: '재직 중', value: 'employed' },
  { label: '구직 중', value: 'job_seeking' },
  { label: '프리랜서', value: 'freelancer' },
  { label: '학생', value: 'student' },
];

export const NETWORK_LIST: { label: string; value: Network }[] = [
  { label: '#커피챗', value: 'coffee_chat' },
  { label: '#프로젝트', value: 'side_project' },
  { label: '#스터디', value: 'study_group' },
];

export const SIGNUP_ERROR_MESSAGES = {
  NICKNAME_TOO_SHORT: '닉네임은 2자 이상 입력해주세요.',
  NICKNAME_DUPLICATE: '이미 사용 중인 닉네임입니다.',
} as const;
