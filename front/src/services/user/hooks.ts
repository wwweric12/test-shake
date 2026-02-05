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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOME.SUMMARY() });
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
      // 1. URL 발급 요청 데이터
      const requestData = {
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
        extension: file.name.substring(file.name.lastIndexOf('.')),
      };

      // 2. 서버로부터 URL 발급
      const { data } = await userApi.getPresignedUrl(requestData);
      const { preSignedUrl, profileImageUrl } = data;

      // 3. S3 직접 업로드
      await userApi.uploadImageToS3(preSignedUrl, file);

      // 4. DB 업데이트 (profileImageUrl이 이미 전체 경로이므로 그대로 전달)
      await userApi.updateProfileImage({ profileImageUrl });

      return profileImageUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.INFO() });
    },
    onError: (error) => {
      alert('이미지 업로드에 실패했습니다.');
    },
  });
};
