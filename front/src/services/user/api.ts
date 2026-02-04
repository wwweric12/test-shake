import { api } from '@/services/api';
import {
  CheckNicknameRequest,
  CheckNicknameResponse,
  DstiRequest,
  DstiResponse,
  PresignedUrlRequest,
  PresignedUrlResponse,
  UpdateCareerRequest,
  UpdateExperienceRequest,
  UpdateGithubRequest,
  UpdateNetworksRequest,
  UpdatePositionsRequest,
  UpdateProfileImageRequest,
  UpdateProfileImageResponse,
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
  // 1. Presigned URL 발급 요청
  getPresignedUrl: (data: PresignedUrlRequest) =>
    api.post<PresignedUrlResponse>('/user/profiles/presigned-url', data),

  // 2. S3 직접 업로드
  uploadImageToS3: async (presignedUrl: string, file: File) => {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('S3 업로드 실패');
    }
    return response;
  },
  // 3. DB에 바뀐 URL 저장
  updateProfileImage: (data: UpdateProfileImageRequest) =>
    api.put<UpdateProfileImageResponse>('/user/profiles/image-url', data),
};
