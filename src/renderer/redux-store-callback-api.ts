import {WindowCallbackApi} from '../window-callback/window-callback-api'
import {EnhancedStore} from '@reduxjs/toolkit'
import {appendDelta, respond, setEndpointCallingPlan} from './features/chat'
import {OpenApiSpec} from '../models/open-api-spec'
import {RootState, store} from './features/store'
import {AuthoredContent, createContent} from '../models/content'
import {Approvable, ApprovalResponse, SecretRequest} from '../models/approvable'
import {HttpRequestPlan} from '../models/http-request-plan'


export class ReduxStoreCallbackApi implements WindowCallbackApi {
  constructor(private readonly store: EnhancedStore) {
  }
  
  requestApproval(approval: Approvable, apiId: string): ApprovalResponse {
    const {tools} = store.getState() as RootState
    const secret = approval as SecretRequest
    const {api} = tools
    // try for a match
    for (const key in api) {
      if (key === apiId) {
        return {
          response: "approve",
          clientId: api[key].clientId,
          clientSecret: api[key].clientSecret,
        } as ApprovalResponse
      }
    }
    // send the first
    for (const key in api) {
      return {
        response: "approve",
        clientId: api[key].clientId,
        clientSecret: api[key].clientSecret,
      } as ApprovalResponse
    }
  }
  
  appendContentDelta(authoredContentDelta: {
    chatId: string,
    messageId: string,
    delta: string,
    closed: boolean
  }): void {
    const {chatId, messageId, delta} = authoredContentDelta
    this.store.dispatch(appendDelta({chatId, messageId, delta}))
  }
  
  loadAllOas(): OpenApiSpec[] {
    const state = this.store.getState() as RootState
    const apis = state.tools.api as Record<string, any>
    const responses = []
    
    for (const key in apis) {
      if (!Object.prototype.hasOwnProperty.call(apis, key)) {
        continue
      }
      const serialized = localStorage.getItem(key)
      if (serialized === null) {
        console.warn(`oas: ${key} not found`)
        continue
      }
      const oas = JSON.parse(serialized)
      responses.push(oas)
    }
    return responses
  }

  setCallingPlan(chatId: string, endpointCallingPlan: HttpRequestPlan[]): void {
    this.store.dispatch(setEndpointCallingPlan({chatId, endpointCallingPlan}))
  }
  
  respondTo(chatId: string, author: string): AuthoredContent {
    const placeHolder = createContent('', chatId, author, 'assistant')
    this.store.dispatch(respond(placeHolder))
    return placeHolder
  }
}
