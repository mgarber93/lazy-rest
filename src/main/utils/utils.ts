import {OpenAPI} from 'openapi-types'
import {HttpRequestPlan, THttp} from '../../models/conversation'


export function parseCalls(plan: string, apiSpec: OpenAPI.Document): HttpRequestPlan[] {
  const endpoints = plan
    .split('\n')
    .filter(str => str.startsWith('API calling'))
    .map(str => str.split(":", 2)[1].trim())
  
  const httpCalls = endpoints.map(endpoint => {
    const [method, path, ...rest] = endpoint.split(' ')
    const mappedMethod = method.toUpperCase() as THttp
    return {
      baseUrl:
      path,
      method: mappedMethod,
      body: {},
      headers: {},
    } as HttpRequestPlan
  })
  
  return httpCalls
}
