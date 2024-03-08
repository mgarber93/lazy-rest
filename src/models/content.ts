import {v4 as uuidv4} from 'uuid';

export type Role = 'system' | 'assistant' | 'user';

export interface AuthoredContent {
  id: string;
  chatId: string;
  message: string;
  author: string;
  role: Role;
}

export function generateId() {
  return uuidv4();
}

export function createContent(message: string, chatId: string, author: string, role: Role): AuthoredContent {
  const id = generateId();
  return {
    id,
    chatId,
    message,
    author,
    role,
  };
}