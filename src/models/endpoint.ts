export type THttp = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface EndpointCallPlan {
  path: string;
  method: THttp;
  background: string;
}

export interface DetailedCall extends EndpointCallPlan {
  body: object | Array<object>;
  headers: Record<string, string>;
}