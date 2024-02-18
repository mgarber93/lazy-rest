import { v4 as uuidv4 } from 'uuid';

export interface AuthoredContent {
  id: string;
  message: string;
  editable: boolean;
  author: string;
}

export function generateId() {
  return uuidv4();
}

export function createContent(message: string, author: string, editable?: boolean, id?: string): AuthoredContent {
  if (!id) {
    id = generateId();
  }
  return {
    id,
    message,
    author,
    editable
  }
}