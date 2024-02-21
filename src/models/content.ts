import {v4 as uuidv4} from 'uuid';

export interface AuthoredContent {
  id: string;
  chatId: string;
  message: string;
  author: string;
}

export function generateId() {
  return uuidv4();
}

export function createContent(message: string, chatId: string, author: string): AuthoredContent {
  const id = generateId();
  return {
    id,
    chatId,
    message,
    author,
  }
}