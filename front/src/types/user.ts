export type Career = 'employed' | 'job_seeking' | 'freelancer' | 'student';

export type Position =
  | 'frontend_developer'
  | 'backend_developer'
  | 'data_ai_engineer'
  | 'game_developer'
  | 'embedded_systems_engineer'
  | 'mobile_app_developer'
  | 'devops_infra_engineer';

export type TechSkill =
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'vue'
  | 'nextjs'
  | 'svelte'
  | 'java'
  | 'spring_framework'
  | 'python'
  | 'django'
  | 'fastapi'
  | 'nodejs'
  | 'nestjs'
  | 'go_language'
  | 'mysql'
  | 'postgresql'
  | 'mongodb'
  | 'redis_cache'
  | 'oracle_database'
  | 'pytorch'
  | 'tensorflow'
  | 'scikit_learn'
  | 'pandas'
  | 'spark_engine'
  | 'hadoop_platform'
  | 'csharp_language'
  | 'cpp_language'
  | 'unity_engine'
  | 'unreal_engine'
  | 'opengl_api'
  | 'c_language'
  | 'raspberry_pi_platform'
  | 'arduino_platform'
  | 'swift_language'
  | 'kotlin'
  | 'flutter'
  | 'react_native'
  | 'aws'
  | 'docker'
  | 'kubernetes'
  | 'firebase'
  | 'jenkins'
  | 'github_actions';

export type Network = 'coffee_chat' | 'study_group' | 'side_project';

export interface UserInfoRequest {
  profileImageUrl: string;
  experience: boolean;
  career: Career;
  positions: Position[];
  techSkills: TechSkill[];
  networks: Network[];
  githubId: string;
  selfIntro: string;
}

export interface UserProfile extends UserInfoRequest {
  nickname: string;
  dsti: string;
}

export interface UserCard {
  user: UserProfile;
}

export interface UserCardsResponse {
  cards: UserCard[];
}

export interface CheckNicknameResponse {
  possible: boolean;
}

export interface DstiResponse {
  dsti: string;
}

export interface CheckNicknameRequest {
  nickname: string;
}

export interface SubmitDstiRequest {
  result: number[];
}

export interface UpdateExperienceRequest {
  experience: boolean;
}

export interface UpdateCareerRequest {
  career: Career;
}

export interface UpdateGithubRequest {
  githubId: string;
}

export interface UpdateSelfIntroRequest {
  selfIntro: string;
}

export interface UpdateTechSkillsRequest {
  techSkills: TechSkill[];
}

export interface UpdatePositionsRequest {
  positions: Position[];
}

export interface UpdateNetworksRequest {
  networks: Network[];
}
