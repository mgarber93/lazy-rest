import {v4} from 'uuid'
import {AuthoredContent} from './content'
import {Responder} from './responder'
import {DetailedCall, EndpointCallPlan} from './endpoint'

export interface PlanController {
  // step 1
  endpointCallingPlan: EndpointCallPlan[];
  // step 2
  detailedPlan: DetailedCall[]
  // step 3
  rawResults: object[]
  // step 4
  interpretedResults: object[]
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
