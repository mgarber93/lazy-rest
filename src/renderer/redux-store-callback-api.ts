import {EnhancedStore} from '@reduxjs/toolkit'
import {WindowCallbackApi} from '../window-callback/window-callback-api'
import {appendDelta, respond} from './features/chat'
import {RootState, store} from './features/store'
import {AuthoredContent, createContent} from '../models/content'
import {ApiConfiguration} from '../models/api-configuration'
import {OpenAPI} from 'openapi-types'
import {ToolState} from './features/tools'
import {Conversation, ConversationId, Plan, PlanId} from '../models/conversation'

export class ReduxStoreCallbackApi implements WindowCallbackApi {
  constructor(private readonly store: EnhancedStore) {
  }
  
  getConversation(id: ConversationId): Conversation {
    throw new Error('Method not implemented.')
  }
  
  updateToolState(toolState: ToolState): void {
    throw new Error('Method not implemented.')
  }
  
  getPlan(id: PlanId): Plan {
    throw new Error('Method not implemented.')
  }
  
  getApi(apiId: string): ApiConfiguration | null {
    const {tools} = store.getState() as RootState
    const {api} = tools
    for (const key in api) {
      if (key === apiId) {
        return api[key]
      }
    }
    return null
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
  
  loadAllOas(): OpenAPI.Document[] {
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
  
  addNewResponse(chatId: string, author: string): AuthoredContent {
    const placeHolder = createContent('', chatId, author, 'assistant')
    this.store.dispatch(respond(placeHolder))
    return placeHolder
  }
  
  getOas(oasId: string): OpenAPI.Document | null {
    const {tools} = this.store.getState() as RootState
    const {api} = tools
    const {fileHandle} = api[oasId]
    const file = localStorage.getItem(fileHandle)
    if (file !== null) {
      const oas = JSON.parse(file) as OpenAPI.Document | null
      return oas
    } else {
      return null
    }
  }
}
