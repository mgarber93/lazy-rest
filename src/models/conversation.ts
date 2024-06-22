import {v4} from 'uuid'
import {AuthoredContent} from './content'
import {Responder} from './responder'
import {ToolState} from '../renderer/features/tools'

export function createConversation(title = ''): Conversation {
  return {
    id: v4(),
    content: [] as AuthoredContent[],
    title,
    created: Date(),
  }
}

export type THttp = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface HttpRequestPlan {
  baseUrl: string;
  path: string;
  method: THttp;
  body?: object | Array<object>;
  headers?: Record<string, string>;
}

export interface CallPlan {
  plannedCalls: HttpRequestPlan[]
  summary: string
}

export interface PlanStep {
  apiId: string                   // used for auth
  background: string
  actionDraft: string
  action?: HttpRequestPlan        // step 1 make from background, draft
  result?: object                 // step 2 make call, parse subset of response (stretch goal)
  resultInterpretation?: string   // step 3 decide to retry, continue to next step, or achieved user goal
}

export interface Plan {
  userGoal: AuthoredContent
  state: object
  steps: PlanStep[]
  step: number
}

export function getCurrentStep(plan: Plan) {
  return plan.steps.at(plan.step)
}

export interface Conversation {
  id: string
  content: AuthoredContent[]
  title: string
  created: string
  responder?: Responder
}


export interface ConversationId {
  id: string
}

export interface PlanId {
  id: string
}


export interface ConversationContext {
  conversationId: ConversationId
  planId: PlanId
  toolState: ToolState
}
