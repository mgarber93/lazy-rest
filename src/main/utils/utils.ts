import {HttpRequestPlan, THttp} from '../../models/http-request-plan'


export function parseCalls(plan: string): HttpRequestPlan[] {
  const endpoints = plan
    .split('\n')
    .filter(str => str.startsWith('API calling'))
    .map(str => str.split(":", 2)[1].trim())
  
  const httpCalls = endpoints.map(endpoint => {
    const [method, path, ...rest] = endpoint.split(' ')
    return {
      method: method.toUpperCase() as THttp,
      path,
      background: rest.join(' '),
    } as HttpRequestPlan
  })
  
  return httpCalls
}
