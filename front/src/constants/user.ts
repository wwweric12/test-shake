import { Career, Network, Position, TechSkill } from '@/types/user';

export const CAREER_LABELS: Record<Career, string> = {
  employed: '재직중',
  job_seeking: '구직중',
  freelancer: '프리랜서',
  student: '학생',
};

export const POSITIONS: Record<Position, { label: string; key: string }> = {
  1: { label: '프론트엔드', key: 'frontend_developer' },
  2: { label: '백엔드', key: 'backend_developer' },
  3: { label: 'AI/Data', key: 'data_ai_engineer' },
  4: { label: '게임 개발', key: 'game_developer' },
  5: { label: '임베디드', key: 'embedded_systems_engineer' },
  6: { label: '모바일', key: 'mobile_app_developer' },
  7: { label: 'Infra/DevOps', key: 'devops_infra_engineer' },
  8: { label: '기획/디자인', key: 'design' },
};

// Networks (Index 1-3)
export const NETWORKS: Record<Network, { label: string; key: string }> = {
  1: { label: '커피챗', key: 'coffee_chat' },
  2: { label: '스터디', key: 'study_group' },
  3: { label: '프로젝트', key: 'side_project' },
};

// Tech Skills (Index 1-43)
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
  44: { label: 'Figma', key: 'figma' },
  45: { label: 'Photoshop', key: 'photoshop' },
  46: { label: 'Illustrator', key: 'illustrator' },
};

// 헬퍼 함수: 인덱스로 라벨 가져오기
export const getPositionLabel = (idx: number) => POSITIONS[idx]?.label ?? '';
export const getNetworkLabel = (idx: number) => NETWORKS[idx]?.label ?? '';
export const getTechSkillLabel = (idx: number) => TECH_SKILLS[idx]?.label ?? '';
