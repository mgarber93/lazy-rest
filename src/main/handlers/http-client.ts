import {singleton} from 'tsyringe'
import fetch from 'node-fetch'
import {Handler} from '../handlers/handler'
import {HttpRequestPlan, HttpResponse} from '../../models/api-call-plan'

@singleton()
export class HttpClient implements Handler<'fetch'> {
  async handle(plan: HttpRequestPlan): Promise<HttpResponse> {
    const response = await fetch(plan.url, {
      method: plan.httpVerb,
      body: typeof plan.body === 'string' ? plan.body : JSON.stringify(plan.body),
      headers: plan.headers,
    })
    const data = await response.json()
    
    return {data, status: response.status}
  }
  
  async getToken(baseUrl: string, clientId: string, clientSecret: string): Promise<string> {
    if (!clientId) {
      throw new Error('clientId is required')
    }
    if (!clientSecret) {
      throw new Error('clientSecret is required')
    }
    
    const buffer = Buffer.from(`${clientId}:${clientSecret}`)
    
    const authOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + buffer.toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    }
    
    const response = await fetch(baseUrl, authOptions)
    if (!response.ok) throw new Error('Network response was not ok.')
    const result = await response.json() as { access_token: string }
    const token = result.access_token
    return token
  }
  
  async get(token: string, baseUrl: string, endpoint: string): Promise<object> {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
    const response = await fetch(`${baseUrl}${endpoint}`, options)
    if (response.ok) {
      const data = await response.json() as object
      return data
    } else {
      return {
        statusCode: response.status,
        statusText: response.statusText,
      }
    }
  }
}
