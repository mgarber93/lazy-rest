import {AuthoredContent} from '../models/content'
import {OpenApiSpec} from '../models/open-api-spec'

export type TWindowSenderChannel = keyof WindowCallbackApi

/**
 * Channels preloader will allow at runtime
 */
export const channelAllowList: TWindowSenderChannel[] = [
  'appendContentDelta',
  'loadAllOas',
  'addNewResponse',
]

/**
 * Declare the api provided by a window to the main process using the WindowSender callback
 * protocol, implemented by Provider. WindowSender makes the return type a promise
 */
export interface WindowCallbackApi {
  appendContentDelta(authoredContentDelta: { chatId: string, messageId: string, delta: string, closed: boolean }): void
  
  loadAllOas(): OpenApiSpec[]
  
  addNewResponse(chatId: string, author: string): AuthoredContent
  
  getOas(oasId: string): OpenApiSpec | undefined
}
