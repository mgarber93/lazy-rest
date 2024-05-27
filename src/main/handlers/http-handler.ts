import {container, singleton} from 'tsyringe'
import {Handler} from './handler'
import {MainWindowCallbackConsumer} from '../main-window-callback-consumer'
import {CallingPlan, SecretRequest} from '../../models/approvable'
import fetch from 'node-fetch'
import {HttpRequestPlan} from '../../models/http-request-plan'

@singleton()
export class HttpHandler implements Handler<'httpCall'> {
  private mainWindowSender = container.resolve(MainWindowCallbackConsumer)
  
  async approveCallingPlan(call: HttpRequestPlan): Promise<string> {
    const callingPlan = {
      type: "CallingPlan",
      calls: [call],
    } as CallingPlan
    const approvalResponse = await this.mainWindowSender.requestApproval({
      type: "SecretRequest",
      plan: callingPlan,
    } as SecretRequest)
    const {clientId, clientSecret} = approvalResponse
    
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
    

    const response = await fetch('https://accounts.spotify.com/api/token', authOptions)
    if (!response.ok) throw new Error('Network response was not ok.')
    const result = await response.json() as { access_token: string }
    const token = result.access_token
    return token
  }
  
  async get(token: string, endpoint: string): Promise<object> {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
      const response = await fetch(`https://api.spotify.com/v1${endpoint}`, options)
      if (response.ok) {
        const data = await response.json() as object
        return data
      } else {
        return {
          statusCode: response.status,
          statusText: response.statusText,
        }
      }
    } catch (e) {
      throw new Error('Problem calling spotify')
    }
  }
  
  async handle(call: HttpRequestPlan) {
    const token = await this.approveCallingPlan(call)
    switch (call.method) {
      case "GET": {
        const response = await this.get(token, call.path)
        console.log(JSON.stringify(response, null, 2))
        return response
      }
    }
    throw new Error(`Not implemented`)
  }
}
