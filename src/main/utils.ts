import {EndpointCallPlan, THttp} from '../models/endpoint'


export function parseCalls(plan: string): EndpointCallPlan[] {
  const endpoints = plan
    .split('\n')
    .filter(str => str.startsWith('API calling'))
    .map(str => str.split(":", 2)[1].trim())
  
  const httpCalls: EndpointCallPlan[] = endpoints.map(endpoint => {
    const [method, path, ...rest] = endpoint.split(' ')
    return {method: method.toUpperCase() as THttp, path, background: rest.join(' ')}
  })
  
  return httpCalls
}
