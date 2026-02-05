import { QUERY_KEYS } from '@/constants/queryKeys';
import { notificationApi } from '@/services/notification/api';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const NOTIFICATION_SIZE = 10;

export const useNotifications = (size: number = NOTIFICATION_SIZE) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.NOTIFICATION.LIST(),
    queryFn: ({ pageParam = 0 }) => notificationApi.getNotifications(pageParam, size),
    getNextPageParam: (lastPage, allPages) => {
      const { hasNext } = lastPage.data.notificationResponse;

      return hasNext ? allPages.length + 1 : undefined;
    },
    initialPageParam: 0,
  });
};

export const useAcceptNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { targetUserId: number }) =>
      notificationApi.acceptNotification({ ...data, is_accepted: true }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION.LIST() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT.ROOMS() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOME.SUMMARY() });
    },
  });
};

export const useRejectNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { targetUserId: number }) =>
      notificationApi.rejectNotification({ ...data, is_accepted: false }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION.LIST() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.HOME.SUMMARY() });
    },
  });
};
