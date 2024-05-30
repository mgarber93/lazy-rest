import {EnhancedStore} from '@reduxjs/toolkit'
import {WindowCallbackApi} from '../window-callback/window-callback-api'
import {appendDelta, respond} from './features/chat'
import {OpenApiSpec} from '../models/open-api-spec'
import {RootState, store} from './features/store'
import {AuthoredContent, createContent} from '../models/content'
import {ApiConfiguration} from '../models/api-configuration'

export class ReduxStoreCallbackApi implements WindowCallbackApi {
  constructor(private readonly store: EnhancedStore) {
  }
  
  getApi(apiId: string): ApiConfiguration {
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
  
  addNewResponse(chatId: string, author: string): AuthoredContent {
    const placeHolder = createContent('', chatId, author, 'assistant')
    this.store.dispatch(respond(placeHolder))
    return placeHolder
  }
}
