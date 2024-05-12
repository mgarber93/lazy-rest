export type THttp = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface HttpRequestPlan {
  baseUrl: string;
  path: string;
  method: THttp;
  background: string;
  body?: object | Array<object>;
  headers?: Record<string, string>;
}
