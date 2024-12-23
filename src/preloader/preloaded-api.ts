import {ClientOptions} from 'openai'
import {TProvider} from '../models/responder'
import {Conversation} from '../models/conversation'
import {TWindowSenderChannel, WindowCallbackApi} from '../window-callback/window-callback-api'
import {HttpRequestPlan, HttpResponse, SummarizationJob} from '../models/api-call-plan'

export type TInvokeChannel = keyof PreloadedApi

export type TWindowSenderCallback<T extends keyof WindowCallbackApi> = (event: never, id: string, ...args: Parameters<WindowCallbackApi[T]>) => ReturnType<WindowCallbackApi[T]>

export const INVOKE_CHANNELS = [
  'callback',
  'getModels',
  'getMachineName',
  'setOpenAiConfiguration',
  'streamedChat',
  'fetch',
  'summarizeResponse'
] as TInvokeChannel[]

export interface WindowSenderProtocol {
  preload(): WindowSenderProtocol
  
  // type unsafe api
  send(channel: TWindowSenderChannel, data: never): void
  
  receive<T extends TWindowSenderChannel>(channel: T, func: TWindowSenderCallback<T>): void
  
  remove(channel: TWindowSenderChannel, func: (...args: never[]) => void): Promise<void>
}

export interface WindowReceiverProtocol {
  callback<T extends keyof WindowCallbackApi>(promiseId: string, arg: ReturnType<WindowCallbackApi[T]>): void
}

// type safe api
export interface PreloadedApi extends WindowSenderProtocol, WindowReceiverProtocol {
  getModels(provider: TProvider): Promise<string[]>
  
  getMachineName(): Promise<string>
  
  setOpenAiConfiguration(config: ClientOptions): Promise<void>
  
  streamedChat(conversation: Conversation): Promise<void>
  
  fetch(plan: HttpRequestPlan): Promise<HttpResponse>
  
  continue(): Promise<void>
  
  summarizeResponse(job: SummarizationJob): Promise<string>
}
