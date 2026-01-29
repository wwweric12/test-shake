export type Career = 'employed' | 'job_seeking' | 'freelancer' | 'student';

// 1-based index types
export type Position = number;
export type TechSkill = number;
export type Network = number;

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
