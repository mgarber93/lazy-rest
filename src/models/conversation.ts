import {AuthoredContent} from './content';
import {TAutoPrompter} from './auto-prompter';


export interface Conversation {
  id: string;
  content: AuthoredContent[];
  title: string;
  responder?: string;
  autoPrompter?: TAutoPrompter
}