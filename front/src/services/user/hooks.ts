import { QUERY_KEYS } from '@/constants/queryKeys';
import { userApi } from '@/services/user/api';
import {
  CheckNicknameResponse,
  DstiRequest,
  UpdateCareerRequest,
  UpdateExperienceRequest,
  UpdateGithubRequest,
  UpdateNetworksRequest,
  UpdatePositionsRequest,
  UpdateProfileImageRequest,
  UpdateSelfIntroRequest,
  UpdateTechSkillsRequest,
  UserProfileRequest,
} from '@/types/user';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useUserProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER.INFO(),
    queryFn: userApi.getUserInfo,
  });
};

export const useOtherUserProfile = (userId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER.INFO(), userId],
    queryFn: () => userApi.getOtherUserInfo(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCheckNicknameMutation = () => {
  return useMutation({
    mutationFn: (nickname: string): Promise<CheckNicknameResponse> =>
      userApi.checkNickname({ nickname }),
  });
};

export const useRegisterUserProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserProfileRequest) => userApi.registerUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.INFO() });
    },
  });
};

export const useSubmitDstiMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DstiRequest) => userApi.submitDsti(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.INFO() });
    },
  });
};

export const useUpdateExperienceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateExperienceRequest) => userApi.updateExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.INFO() });
    },
  });
};

export const useUpdateCareerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCareerRequest) => userApi.updateCareer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.INFO() });
    },
  });
};

export const useUpdateGithubMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGithubRequest) => userApi.updateGithub(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.INFO() });
    },
  });
};

export const useUpdateSelfIntroMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSelfIntroRequest) => userApi.updateSelfIntro(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.INFO() });
    },
  });
};

export const useUpdateTechSkillsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTechSkillsRequest) => userApi.updateTechSkills(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.INFO() });
    },
  });
};

export const useUpdatePositionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePositionsRequest) => userApi.updatePositions(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.INFO() });
    },
  });
};

export const useUpdateNetworksMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateNetworksRequest) => userApi.updateNetworks(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.INFO() });
    },
  });
};

export const useUpdateProfileImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // Step 1: Presigned URL 요청 데이터 준비
      const requestData = {
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
        extension: file.name.substring(file.name.lastIndexOf('.')),
      };

      // Step 2: 서버로부터 URL 발급
      const response = await userApi.getPresignedUrl(requestData);
      const { preSignedUrl, profileImageUrl } = response.data;

      console.log('S3 업로드 경로 (PUT 대상):', preSignedUrl);
      console.log('DB 저장용 경로 (CloudFront):', profileImageUrl);

      // Step 3: S3에 파일 직접 업로드
      await userApi.uploadImageToS3(preSignedUrl, file);

      // Step 4: 우리 서버 DB에 이미지 URL 주소 업데이트
      await userApi.updateProfileImage({ profileImageUrl });

      return profileImageUrl;
    },
    onSuccess: () => {
      // 프로필 이미지 변경 후 사용자 정보 캐시 무효화
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.INFO() });
    },
    onError: (error) => {
      console.error('이미지 업로드 실패:', error);
    },
  });
};
