import {v4} from 'uuid'
import {AuthoredContent} from './content'
import {Responder} from './responder'
import {HttpRequestPlan} from './http-request-plan'

export interface Plan {
  state: object;
  endpointCallingPlan: HttpRequestPlan[];
  step: number;
  result: object;
  resultInterpretation: string;
}

export interface History {
  type: "call" | "response";
}

export function createConversation(title = ''): Conversation {
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
  planController?: Plan;
}
