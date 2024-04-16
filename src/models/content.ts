import {v4 as uuidv4} from 'uuid';

export type Role = 'system' | 'assistant' | 'user' | 'tool';

export interface ContentDelta {
  chatId: string
  messageId: string
  delta: string
}

export interface AuthoredContent {
  id: string;
  chatId: string;
  message: string;
  author: string;
  role: 'system' | 'assistant' | 'user' | 'tool';
}

export interface ToolCall extends AuthoredContent {
  role: 'tool';
  tool_call_id: string;
  tool_calls: { function: string, id: string }[]
}

export function isToolCall(content: AuthoredContent): content is ToolCall {
  return content.role === 'tool' && content.hasOwnProperty('tool_call_id');
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

export function copy(content: AuthoredContent) {
  return {
    ...content,
  };
}