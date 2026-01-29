import { QUERY_KEYS } from '@/constants/queryKeys';
import { notificationApi } from '@/services/notification/api';
import { AcceptNotificationRequest, RejectNotificationRequest } from '@/types/notification';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useNotifications = () => {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATION.LIST(),
    queryFn: notificationApi.getNotifications,
  });
};

//TODO: 수정 중
// export const useTargetProfile = () => {
//   return useQuery({
//     queryKey: QUERY_KEYS.NOTIFICATION.TARGET_PROFILE(),
//     queryFn: notificationApi.getTargetProfile,
//   });
// };

export const useAcceptNotificationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      notificationId,
      data,
    }: {
      notificationId: number;
      data: AcceptNotificationRequest | RejectNotificationRequest;
    }) => notificationApi.acceptNotification(notificationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATION.LIST() });
    },
  });
};
