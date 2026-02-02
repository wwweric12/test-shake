import { ApiEmptyResponse, ApiResponse } from '@/types/common';

export type Career = 'employed' | 'job_seeking' | 'freelancer' | 'student';

// 1-based index types
export type Position = number;
export type TechSkill = number;
export type Network = number;

export interface UserProfile {
  profileImageUrl: string;
  nickname: string;
  experience: boolean;
  career: Career;
  positions: Position[];
  techSkills: TechSkill[];
  networks: Network[];
  githubId: string;
  selfIntro: string;
}

export interface UserInfo extends UserProfile {
  userId: number;
  dsti: string;
  matchingPercent: number;
}

// Request

export type UserProfileRequest = UserProfile;

export type CheckNicknameRequest = { nickname: string };

export type DstiRequest = { result: number[] };

export type UpdateResponse = ApiEmptyResponse;

export type UpdateExperienceRequest = { experience: boolean };
export type UpdateCareerRequest = { career: Career };
export type UpdateGithubRequest = { githubId: string };
export type UpdateSelfIntroRequest = { selfIntro: string };
export type UpdateTechSkillsRequest = { techSkills: TechSkill[] };
export type UpdatePositionsRequest = { positions: Position[] };
export type UpdateNetworksRequest = { networks: Network[] };

// Response

export type UserInfoResponse = ApiResponse<UserInfo>;

export type UserProfileResponse = ApiEmptyResponse;

export type CheckNicknameResponse = ApiEmptyResponse;

export type DstiResponse = ApiResponse<{ dsti: string }>;

export type UserInfoIdResponse = ApiResponse<UserInfo>;

export type UpdateExperienceResponse = ApiEmptyResponse;
export type UpdateCareerResponse = ApiEmptyResponse;
export type UpdateGithubResponse = ApiEmptyResponse;
export type UpdateSelfIntroResponse = ApiEmptyResponse;
export type UpdateTechSkillsResponse = ApiEmptyResponse;
export type UpdatePositionsResponse = ApiEmptyResponse;
export type UpdateNetworksResponse = ApiEmptyResponse;
