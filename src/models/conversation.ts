import {v4} from 'uuid';
import {AuthoredContent} from './content';
import {Responder} from './responder';


export function createConversation(title: string = ''): Conversation {
  return {
    id: v4(),
    content: [] as AuthoredContent[],
    title,
    created: Date(),
  }
}

export interface Conversation {
  id: string;
  content: AuthoredContent[];
  title: string;
  responder?: Responder;
  created: string;
}
