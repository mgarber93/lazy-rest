import {EnhancedStore} from '@reduxjs/toolkit'
import {RootState, store} from './renderer/features/store'
import {HttpRequestPlan} from './models/http-request-plan'
import {AuthoredContent, createContent} from './models/content'
import {channelAllowList, TWindowSenderChannel, WindowCallbackApi} from './window-callback/window-callback-api'
import {OpenApiSpec} from './models/open-api-spec'

export class ConnectCallbacks implements WindowCallbackApi {
  constructor(private readonly store: EnhancedStore) {}
  messageDelta(authoredContentDelta: any): void {
    throw new Error('Method not implemented.')
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
  
  presentCallingPlan(chatId: string, calls: HttpRequestPlan[]): void {
    throw new Error('Method not implemented.')
  }
  
  respondTo(chatId: string): AuthoredContent {
    throw new Error('Method not implemented.')
  }
}
// const handleMessageDelta = (electronEvent: any, authoredContentDelta: any) => {
//   const {chatId, messageId, delta, closed} = authoredContentDelta
//   store.dispatch(appendDelta({chatId, messageId, delta}))
// }
// window.main.receive('messageDelta', handleMessageDelta)
//
// const handleCallingPlan = (event: any, chatId: string, endpointCallingPlan: HttpRequestPlan[]) => {
//   store.dispatch(setEndpointCallingPlan({chatId, endpointCallingPlan}))
// }
// window.main.receive('presentCallingPlan', handleCallingPlan)
//
// const handleResponse = (event: any, id: string, chatId: string, author: string) => {
//   const placeHolder = createContent('', chatId, author, 'assistant')
//   store.dispatch(respond(placeHolder))
//   window.main.callback(id, placeHolder)
// }
// window.main.receive('respondTo', handleResponse)

/**
 * @param store
 */
export const connectCallbacks = (store: EnhancedStore) => {
  const callbacks = new ConnectCallbacks(store)
  channelAllowList.forEach(channelAllowList => {
    window.main.receive<TWindowSenderChannel>(channelAllowList, (event:  Electron. IpcRendererEvent, promiseId: string, ...args: Parameters<typeof callbacks[typeof channelAllowList]>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = callbacks[channelAllowList](...args)
      window.main.callback(promiseId, result)
    })
  })
}
