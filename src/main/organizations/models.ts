import {OpenAPI} from 'openapi-types'

export interface ApiCallPlan {
  userGoal: string
  state: object
  steps: PlanStep[]
  step: number
  endpoints: string
  oasSpec: OpenAPI.Document[]
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
  steps: string[]
  apiId?: string                   // used for auth
  result?: object                 // step 2 make call, parse subset of response (stretch goal)
  resultInterpretation?: string   // step 3 decide to retry, continue to next step, or achieved user goal
}
