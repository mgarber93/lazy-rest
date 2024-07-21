import {OpenAPI} from 'openapi-types'
import {HttpRequestPlan, THttp} from '../organizations/api-call-plan'


export function parseCalls(plan: string, apiSpec: OpenAPI.Document): HttpRequestPlan[] {
  const endpoints = plan
    .split('\n')
    .filter(str => str.startsWith('API calling'))
    .map(str => str.split(":", 2)[1].trim())
  
  const httpCalls = endpoints.map(endpoint => {
    const [method, path] = endpoint.split(' ')
    const mappedMethod = method.toUpperCase() as THttp
    const baseUrl = ''
    // @todo need to parse calls from an actually parsed spe
    return {
      baseUrl,
      path,
      method: mappedMethod,
      body: {},
      headers: {},
    } as HttpRequestPlan
  })
  
  return httpCalls
}
