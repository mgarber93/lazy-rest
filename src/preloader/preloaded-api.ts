import {TProvider} from '../models/responder'
import {Conversation, Plan} from '../models/conversation'
import {OpenAiConfiguration} from '../models/provider-config'
import {AuthoredContent} from '../models/content'
import {HttpRequestPlan} from '../models/http-request-plan'
import {TWindowSenderChannel, WindowCallbackApi} from '../window-callback/window-callback-api'
import {Preloader} from './preloader'

export type TInvokeChannel = keyof PreloadedApi

export const INVOKE_CHANNELS = [
  'streamedChat',
  'getMachineName',
  'setOpenAiConfiguration',
  'callback',
  'detailCallInPlan',
  'httpCall',
  'getModels',
  'interpretResult',
] as TInvokeChannel[]

export interface WindowSenderProtocol {
  preload(): WindowSenderProtocol
  
  // type unsafe api
  send(channel: TWindowSenderChannel, data: any): void
  
  receive<T extends TWindowSenderChannel>(channel: T, func: (event: never,  id: string, ...args: Parameters<WindowCallbackApi[T]>) => ReturnType<WindowCallbackApi[T]>): void
  
  remove(channel: TWindowSenderChannel, func: (...args: any[]) => void): Promise<void>
}

export interface WindowReceiverProtocol {
  callback<T extends keyof WindowCallbackApi>(promiseId: string, arg: ReturnType<WindowCallbackApi[T]>): void;
}

// type safe api
export interface PreloadedApi extends WindowSenderProtocol {
  getModels(provider: TProvider): Promise<string>
  
  getMachineName(): Promise<string>
  
  setOpenAiConfiguration(config: OpenAiConfiguration): Promise<void>
  
  detailCallInPlan(userContent: AuthoredContent, plan: HttpRequestPlan): Promise<HttpRequestPlan>
  
  httpCall(call: HttpRequestPlan): Promise<object>
  
  streamedChat(conversation: Conversation): Promise<void>
  
  interpretResult(conversation: Conversation): Promise<Plan>
}
