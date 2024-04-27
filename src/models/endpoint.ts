export type THttp = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface EndpointCallPlan {
  path: string;
  method: THttp;
  background: string;
}