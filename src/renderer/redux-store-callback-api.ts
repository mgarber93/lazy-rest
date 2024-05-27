import {WindowCallbackApi} from '../window-callback/window-callback-api'
import {EnhancedStore} from '@reduxjs/toolkit'
import {appendDelta, respond, setEndpointCallingPlan} from './features/chat'
import {OpenApiSpec} from '../models/open-api-spec'
import {RootState, store} from './features/store'
import {HttpRequestPlan} from '../models/http-request-plan'
import {AuthoredContent, createContent} from '../models/content'
import {Approvable, ApprovalResponse} from '../models/approvable'


export class ReduxStoreCallbackApi implements WindowCallbackApi {
  constructor(private readonly store: EnhancedStore) {
  }
  
  requestApproval(approval: Approvable): ApprovalResponse {
    throw new Error('Method not implemented.')
  }
  
  appendContentDelta(authoredContentDelta: {
    chatId: string,
    messageId: string,
    delta: string,
    closed: boolean
  }): void {
    const {chatId, messageId, delta} = authoredContentDelta
    store.dispatch(appendDelta({chatId, messageId, delta}))
  }
  
  loadAllOas(): OpenApiSpec[] {
    const state = store.getState() as RootState
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
      return
    }
  }
  
  presentCallingPlan(chatId: string, endpointCallingPlan: HttpRequestPlan[]): string {
    store.dispatch(setEndpointCallingPlan({chatId, endpointCallingPlan}))
    throw new Error('todo load token?')
  }
  
  respondTo(chatId: string, author: string): AuthoredContent {
    const placeHolder = createContent('', chatId, author, 'assistant')
    store.dispatch(respond(placeHolder))
    return placeHolder
  }
}
