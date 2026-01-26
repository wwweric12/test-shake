import { authHandlers } from './handlers/auth';
import { chatHandlers } from './handlers/chat';
import { homeHandlers } from './handlers/home';
import { notificationHandlers } from './handlers/notification';
import { recommendationHandlers } from './handlers/recommendation';
import { userHandlers } from './handlers/user';

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...homeHandlers,
  ...notificationHandlers,
  ...chatHandlers,
  ...recommendationHandlers,
];
