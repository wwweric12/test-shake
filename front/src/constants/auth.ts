import { Career, Network, Position, TechSkill, UserInfo } from '@/types/user';

export const INITIAL_SIGNUP_DATA: UserInfo = {
  userId: 0,
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
  matchingPercent: 0,
};

export const STEP_INFO: Record<string, { index: number; title: string }> = {
  step1: { index: 1, title: '기본 프로필 정보' },
  step2: { index: 2, title: '네트워킹 정보' },
} as const;

export const SIGNUP_MESSAGES: Record<string, string> = {
  // 가이드 및 라벨
  NICKNAME_GUIDE: '※ 한 번 생성한 닉네임은 수정할 수 없습니다. (2~10자, 공백 불가)',
  GITHUB_GUIDE: 'https://github.com/',
  GITHUB_NO_CHECK: 'Github 주소가 없어요.',
  NETWORKING_GUIDE: '복수 선택 가능합니다.',
  POSITION_GUIDE: '최대 3개를 선택할 수 있습니다.',
  STACK_GUIDE: '최대 5개를 선택할 수 있습니다.',
  INTRO_GUIDE: '복수 선택 가능합니다.',
  INTRO_COUNT_LIMIT: '/200',

  // 성공 메시지
  SUCCESS_NICKNAME: '사용 가능한 닉네임입니다.',
  STATUS_LOADING: '확인 중...',

  // 에러 메시지
  DEFAULT_SUBMIT: '정보 저장 중 오류가 발생했습니다.',
  ERROR_NICKNAME_LENGTH: '닉네임은 2자 이상 입력해주세요.',
  ERROR_NICKNAME_DUPLICATE: '이미 사용 중인 닉네임입니다.',
  ERROR_NICKNAME_CHECK_FAILED: '중복 확인 중 오류가 발생했습니다.',
  ERROR_CHECK_REQUIRED: '닉네임 중복 확인이 필요합니다.',
  ERROR_EXPERIENCE_REQUIRED: '실무 개발 경험 여부를 선택해주세요.',
  ERROR_CAREER_REQUIRED: '현재 상태를 선택해주세요.',
  ERROR_NETWORKS_REQUIRED: '네트워킹 목적을 최소 하나 선택해주세요.',
  ERROR_GITHUB_REQUIRED: 'Github 아이디를 입력해주세요.',
  ERROR_POSITION_REQUIRED: '직무를 최소 하나 선택해주세요.',
  ERROR_SKILL_REQUIRED: '스택을 최소 하나 선택해주세요.',
  ERROR_INTRO_REQUIRED: '자기소개를 입력해주세요.',
} as const;

export const SIGNUP_PLACEHOLDERS = {
  NICKNAME: '닉네임을 입력해주세요',
  GITHUB_ID: 'ID',
  SELF_INTRO:
    '구체적일수록 매칭 확률이 올라가요! 나누고 싶은 대화 주제를 적어주세요. \nex) 도메인 설계나 프로젝트 효율화에 관심이 많습니다. 편하게 좋아요 눌러주세요!',
} as const;

export const EXPERIENCE_LIST = [
  { label: '경험 있음', value: true },
  { label: '경험 없음', value: false },
] as const;

export const CAREER_LIST: { label: string; value: Career }[] = [
  { label: '재직중', value: 'employed' },
  { label: '구직중', value: 'job_seeking' },
  { label: '프리랜서', value: 'freelancer' },
  { label: '학생', value: 'student' },
];

export const NETWORK_LIST: { label: string; value: Network }[] = [
  { label: '#커피챗', value: 1 },
  { label: '#프로젝트', value: 2 },
  { label: '#스터디', value: 3 },
];

export const POSITIONS: Record<Position, { label: string; key: string }> = {
  1: { label: '프론트엔드', key: 'frontend_developer' },
  2: { label: '백엔드', key: 'backend_developer' },
  3: { label: 'AI/Data', key: 'data_ai_engineer' },
  4: { label: '게임 개발', key: 'game_developer' },
  5: { label: '임베디드', key: 'embedded_systems_engineer' },
  6: { label: '모바일', key: 'mobile_app_developer' },
  7: { label: 'Infra/DevOps', key: 'devops_infra_engineer' },
  8: { label: '기획/디자인', key: 'product_planning_design' },
};

export const TECH_SKILLS: Record<TechSkill, { label: string; key: string }> = {
  1: { label: 'JavaScript', key: 'javascript' },
  2: { label: 'TypeScript', key: 'typescript' },
  3: { label: 'React', key: 'react' },
  4: { label: 'Vue.js', key: 'vue' },
  5: { label: 'Next.js', key: 'nextjs' },
  6: { label: 'Svelte', key: 'svelte' },
  7: { label: 'Java', key: 'java' },
  8: { label: 'Spring', key: 'spring_framework' },
  9: { label: 'Python', key: 'python' },
  10: { label: 'Django', key: 'django' },
  11: { label: 'FastAPI', key: 'fastapi' },
  12: { label: 'Node.js', key: 'nodejs' },
  13: { label: 'NestJS', key: 'nestjs' },
  14: { label: 'Go', key: 'go_language' },
  15: { label: 'MySQL', key: 'mysql' },
  16: { label: 'PostgreSQL', key: 'postgresql' },
  17: { label: 'MongoDB', key: 'mongodb' },
  18: { label: 'Redis', key: 'redis_cache' },
  19: { label: 'Oracle', key: 'oracle_database' },
  20: { label: 'PyTorch', key: 'pytorch' },
  21: { label: 'TensorFlow', key: 'tensorflow' },
  22: { label: 'Scikit-learn', key: 'scikit_learn' },
  23: { label: 'pandas', key: 'pandas' },
  24: { label: 'Spark', key: 'spark_engine' },
  25: { label: 'Hadoop', key: 'hadoop_platform' },
  26: { label: 'C#', key: 'csharp_language' },
  27: { label: 'C++', key: 'cpp_language' },
  28: { label: 'Unity', key: 'unity_engine' },
  29: { label: 'Unreal Engine', key: 'unreal_engine' },
  30: { label: 'OpenGL', key: 'opengl_api' },
  31: { label: 'C', key: 'c_language' },
  32: { label: 'Raspberry Pi', key: 'raspberry_pi_platform' },
  33: { label: 'Arduino', key: 'arduino_platform' },
  34: { label: 'Swift', key: 'swift_language' },
  35: { label: 'Kotlin', key: 'kotlin' },
  36: { label: 'Flutter', key: 'flutter' },
  37: { label: 'React Native', key: 'react_native' },
  38: { label: 'AWS', key: 'aws' },
  39: { label: 'Docker', key: 'docker' },
  40: { label: 'Kubernetes', key: 'kubernetes' },
  41: { label: 'Firebase', key: 'firebase' },
  42: { label: 'Jenkins', key: 'jenkins' },
  43: { label: 'GitHub Actions', key: 'github_actions' },
  44: { label: 'Figma', key: 'figma_design_tool' },
  45: { label: 'Photoshop', key: 'photoshop_design_tool' },
  46: { label: 'Illustrator', key: 'illustrator_design_tool' },
};

export const getPositionLabel = (idx: number) => POSITIONS[idx]?.label ?? '';
export const getTechSkillLabel = (idx: number) => TECH_SKILLS[idx]?.label ?? '';
