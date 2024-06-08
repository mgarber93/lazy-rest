import {v4} from 'uuid'
import {AuthoredContent} from './content'
import {Responder} from './responder'

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

/**
 * Aka conversation context
 */
export interface Conversation {
  id: string
  content: AuthoredContent[]
  title: string
  created: string
  responder?: Responder
  tools?: ToolProvider
}

export interface ToolProvider {
  getPlan(id: string): Plan | null
  
  // other stuff like a video stream, search engine, etc
  // talk to something when we are both watching something
}
