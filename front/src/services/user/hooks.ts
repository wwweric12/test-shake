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
