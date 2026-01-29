import { api } from '@/services/api';
import {
  CheckNicknameRequest,
  CheckNicknameResponse,
  DstiResponse,
  SubmitDstiRequest,
  UpdateCareerRequest,
  UpdateExperienceRequest,
  UpdateGithubRequest,
  UpdateNetworksRequest,
  UpdatePositionsRequest,
  UpdateSelfIntroRequest,
  UpdateTechSkillsRequest,
  UserInfoRequest,
  UserProfile,
} from '@/types/user';

export const userApi = {
  getUserInfo: () => api.get<UserProfile>('/user/info'),
  registerUserProfile: (data: UserInfoRequest) => api.post('/user/info', data),

  checkNickname: (data: CheckNicknameRequest) =>
    api.post<CheckNicknameResponse>('/user/nickname', data),

  submitDsti: (data: SubmitDstiRequest) => api.post<DstiResponse>('/user/dsti', data),

  updateExperience: (data: UpdateExperienceRequest) => api.put('/user/experience', data),
  updateCareer: (data: UpdateCareerRequest) => api.put('/user/career', data),
  updateGithub: (data: UpdateGithubRequest) => api.put('/user/github', data),
  updateSelfIntro: (data: UpdateSelfIntroRequest) => api.put('/user/self-intro', data),
  updateTechSkills: (data: UpdateTechSkillsRequest) => api.put('/user/tech-skills', data),
  updatePositions: (data: UpdatePositionsRequest) => api.put('/user/position', data),
  updateNetworks: (data: UpdateNetworksRequest) => api.put('/user/networks', data),
};
