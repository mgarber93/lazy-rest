import {v4} from 'uuid'
import {AuthoredContent} from './content'
import {Responder} from './responder'
import {EndpointCallPlan} from './endpoint'

export interface PlanController {
  endpointCallingPlan: EndpointCallPlan[];
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
  planController?: PlanController;
}
