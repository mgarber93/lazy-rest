import {TProvider} from '../models/responder'
import {Conversation, Plan} from '../models/conversation'
import {OpenAiConfiguration} from '../models/provider-config'
import {AuthoredContent} from '../models/content'
import {HttpRequestPlan} from '../models/http-request-plan'
import {TWindowSenderChannel} from '../models/window-sender'

export type TInvokeChannel = keyof PreloadedApi

export const INVOKE_CHANNELS = [
  'streamedChat',
  'getMachineName',
  'setOpenAiConfiguration',
  'callback',
  'detailCallInPlan',
  'httpCall',
  'getModels',
  'interpretResult'
] as TInvokeChannel[]

export interface Preloader {
  preload(invokeChannels: (keyof PreloadedApi)[]): TInvokeChannel[]

  // type unsafe api
  send(channel: TWindowSenderChannel, data: any): void

  receive(channel: TWindowSenderChannel, func: (...args: any[]) => void): void

  remove(channel: TWindowSenderChannel, func: (...args: any[]) => void): Promise<void>
}

// type safe api
export interface PreloadedApi extends Preloader {
  getModels(provider: TProvider): Promise<string>
  
  getMachineName(): Promise<string>
  
  setOpenAiConfiguration(config: OpenAiConfiguration): Promise<void>
  
  callback(id: string, arg: any): Promise<void>
  
  detailCallInPlan(userContent: AuthoredContent, plan: HttpRequestPlan): Promise<HttpRequestPlan>
  
  httpCall(call: HttpRequestPlan): Promise<object>
  
  streamedChat(conversation: Conversation): Promise<void>
  
  interpretResult(conversation: Conversation): Promise<Plan>
}
