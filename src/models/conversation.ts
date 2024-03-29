import {AuthoredContent} from './content';
import {TAutoPrompter} from './auto-prompter';
import {v4} from 'uuid';


export function createConversation(title: string = ''): Conversation {
  return {
    id: v4(),
    content: [] as AuthoredContent[],
    title,
    created: Date()
  }
}

export interface Conversation {
  id: string;
  content: AuthoredContent[];
  title: string;
  responder?: Responder;
  created: string;
}

export interface Responder {
  name: string;
}

export interface Model extends Responder {
  provider: "openai" | "anthropic";
  name: string;
  baseUrl: string;
  secret: string;
}

export interface Agent extends Model {
  instructions: string;
}

export interface AgentOrg extends Responder {
  name: string;
  agents: Agent[];
}