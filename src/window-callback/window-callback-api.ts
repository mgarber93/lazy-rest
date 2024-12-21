import {AuthoredContent} from '../models/content'
import {OpenAPI} from 'openapi-types'
import {Conversation, ConversationId, PlanId} from '../models/conversation'
import {ProviderConfiguration} from '../models/api-configuration'
import {ApiCallPlan} from '../models/api-call-plan'
import {UpdateStepActivityPayload} from '../renderer/features/chat'

export type TWindowSenderChannel = keyof WindowCallbackApi

/**
 * Channels preloader will allow at runtime
 */
export const channelAllowList: TWindowSenderChannel[] = [
  'appendContentDelta',
  'loadAllOas',
  'appendContent',
  'getOas',
  'getConversation',
  'getPlan',
  'getProviderConfig',
  'notify'
]

/**
 * Declare the api provided by a window to the main process using the WindowSender callback
 * protocol, implemented by Provider. WindowSender makes the return type a promise
 */
export interface WindowCallbackApi {
  appendContentDelta(authoredContentDelta: { chatId: string, messageId: string, delta: string, closed: boolean }): void
  
  loadAllOas(): OpenAPI.Document[]
  
  appendContent(content: AuthoredContent): void
  
  getOas(oasId: string): OpenAPI.Document | null
  
  getConversation(id: ConversationId): Conversation | null
  
  updateStep(state: UpdateStepActivityPayload): void
  
  getPlan(id: PlanId): ApiCallPlan | null
  
  getProviderConfig(): ProviderConfiguration
  
  notify(message: string): void
}
