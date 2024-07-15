import {AuthoredContent} from '../models/content'
import {OpenAPI} from 'openapi-types'
import {Conversation, ConversationId, Plan, PlanId} from '../models/conversation'
import {ToolState} from '../renderer/features/tools'

export type TWindowSenderChannel = keyof WindowCallbackApi

/**
 * Channels preloader will allow at runtime
 */
export const channelAllowList: TWindowSenderChannel[] = [
  'appendContentDelta',
  'loadAllOas',
  'addNewResponse',
  'getConversation',
  'getPlan',
]

/**
 * Declare the api provided by a window to the main process using the WindowSender callback
 * protocol, implemented by Provider. WindowSender makes the return type a promise
 */
export interface WindowCallbackApi {
  appendContentDelta(authoredContentDelta: { chatId: string, messageId: string, delta: string, closed: boolean }): void
  
  loadAllOas(): OpenAPI.Document[]
  
  addNewResponse(chatId: string, author: string): AuthoredContent
  
  getOas(oasId: string): OpenAPI.Document | null
  
  getConversation(id: ConversationId): Conversation | null
  
  updateToolState(toolState: ToolState): void
  
  getPlan(id: PlanId): Plan | null
}
