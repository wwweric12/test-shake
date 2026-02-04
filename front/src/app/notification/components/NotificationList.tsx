"use client";

import { NotificationData } from '@/types/notification';

import NotificationEmpty from './NotificationEmpty';
import NotificationItem from './NotificationItem';

interface NotificationListProps {
  notifications: NotificationData[];
  onAccept: (targetUserId: number) => void;
  onReject: (targetUserId: number) => void;
  isPending: boolean;
}

export default function NotificationList({ 
  notifications, 
  onAccept, 
  onReject,
  isPending 
}: NotificationListProps) {
  
  if (notifications.length === 0) {
    return <NotificationEmpty />;
  }

  return (
    <div className="flex flex-col gap-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.targetUserId}
          notification={notification}
          onAccept={onAccept}
            onReject={onReject}
            isPending={isPending}
        />
      ))}
    </div>
  );
}