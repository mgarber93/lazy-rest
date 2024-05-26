import {IpcMainInvokeEvent} from 'electron'
import {TProvider} from '../models/responder'
import {Conversation} from '../models/conversation'
import {OpenAiConfiguration} from '../models/provider-config'
import {AuthoredContent} from '../models/content'
import {HttpRequestPlan} from '../models/http-request-plan'
import {TAgent} from '../main/organizations/swagger-gpt'
import {TWindowSenderChannel} from '../models/window-sender'

export type TInvokeChannel = keyof PreloadedApi

export interface PreloadedApiHandler<T extends keyof PreloadedApi> {
  channel: TInvokeChannel
  handle: (event: IpcMainInvokeEvent, ...args: Parameters<PreloadedApi[T]>) => ReturnType<PreloadedApi[T]>
}

export const INVOKE_CHANNELS = [
  'streamedChat',
  'getMachineName',
  'setOpenAiConfiguration',
  'callback',
  'detailCallInPlan',
  'httpCall',
  'getModels',
  'streamAgentResponse',
] as TInvokeChannel[]

export interface PreloadedApi {
  preload(invokeChannels: (keyof PreloadedApi)[]): TInvokeChannel[]
  
  getModels(provider: TProvider): Promise<string>
  
  getMachineName(): Promise<string>
  
  setOpenAiConfiguration(config: OpenAiConfiguration): Promise<void>
  
  callback(id: string, arg: any): Promise<void>
  
  detailCallInPlan(userContent: AuthoredContent, plan: HttpRequestPlan): Promise<HttpRequestPlan>
  
  httpCall(call: HttpRequestPlan): Promise<object>
  
  streamedChat(conversation: Conversation): Promise<void>
  
  streamAgentResponse(convo: Conversation, agent: TAgent): Promise<void>
  
  send(channel: TWindowSenderChannel, data: any): void
  
  receive(channel: TWindowSenderChannel, func: (...args: any[]) => void): void
  
  remove(channel: TWindowSenderChannel, func: (...args: any[]) => void): Promise<void>
}
