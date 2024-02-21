import {AuthoredContent} from './content';

export interface Conversation {
  id: string;
  content: AuthoredContent[];
  title: string;
}