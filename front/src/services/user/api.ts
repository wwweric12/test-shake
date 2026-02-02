import { api } from '@/services/api';
import {
  CheckNicknameRequest,
  CheckNicknameResponse,
  DstiRequest,
  DstiResponse,
  UpdateCareerRequest,
  UpdateExperienceRequest,
  UpdateGithubRequest,
  UpdateNetworksRequest,
  UpdatePositionsRequest,
  UpdateResponse,
  UpdateSelfIntroRequest,
  UpdateTechSkillsRequest,
  UserInfoResponse,
  UserProfileRequest,
  UserProfileResponse,
} from '@/types/user';

export const userApi = {
  getUserInfo: () => api.get<UserInfoResponse>('/user/info'),
  registerUserProfile: (data: UserProfileRequest) =>
    api.post<UserProfileResponse>('/user/info', data),

  getOtherUserInfo: (userId: number) => api.get<UserInfoResponse>(`/user/info/${userId}`),

  checkNickname: (data: CheckNicknameRequest) =>
    api.post<CheckNicknameResponse>('/user/nickname', data),

  submitDsti: (data: DstiRequest) => api.post<DstiResponse>('/user/dsti', data),

  updateExperience: (data: UpdateExperienceRequest) =>
    api.put<UpdateResponse>('/user/experience', data),
  updateCareer: (data: UpdateCareerRequest) => api.put<UpdateResponse>('/user/career', data),
  updateGithub: (data: UpdateGithubRequest) => api.put<UpdateResponse>('/user/github', data),
  updateSelfIntro: (data: UpdateSelfIntroRequest) =>
    api.put<UpdateResponse>('/user/self-intro', data),
  updateTechSkills: (data: UpdateTechSkillsRequest) =>
    api.put<UpdateResponse>('/user/tech-skills', data),
  updatePositions: (data: UpdatePositionsRequest) =>
    api.put<UpdateResponse>('/user/position', data),
  updateNetworks: (data: UpdateNetworksRequest) => api.put<UpdateResponse>('/user/networks', data),
};
