import {AuthoredContent} from './content';
import {TAutoPrompter} from './auto-prompter';
import {v4} from 'uuid';


export function createConversation(): Conversation {
  return {
    id: v4(),
    content: [] as AuthoredContent[],
    title: '',
  }
}

export interface Conversation {
  id: string;
  content: AuthoredContent[];
  title: string;
  responder?: string;
  autoPrompter?: TAutoPrompter
}