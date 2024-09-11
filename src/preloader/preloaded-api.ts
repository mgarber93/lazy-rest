import {TProvider} from '../models/responder'
import {Conversation} from '../models/conversation'
import {OpenAiConfiguration} from '../models/provider-config'
import {TWindowSenderChannel, WindowCallbackApi} from '../window-callback/window-callback-api'
import {ApiCallPlan} from '../main/organizations/models'

export type TInvokeChannel = keyof PreloadedApi

export type TWindowSenderCallback<T extends keyof WindowCallbackApi> = (event: never, id: string, ...args: Parameters<WindowCallbackApi[T]>) => ReturnType<WindowCallbackApi[T]>

export const INVOKE_CHANNELS = [
  'streamedChat',
  'getMachineName',
  'setOpenAiConfiguration',
  'callback',
  'getModels',
  'continuePlan',
] as TInvokeChannel[]

export interface WindowSenderProtocol {
  preload(): WindowSenderProtocol
  
  // type unsafe api
  send(channel: TWindowSenderChannel, data: never): void
  
  receive<T extends TWindowSenderChannel>(channel: T, func: TWindowSenderCallback<T>): void
  
  remove(channel: TWindowSenderChannel, func: (...args: never[]) => void): Promise<void>
}

export interface WindowReceiverProtocol {
  callback<T extends keyof WindowCallbackApi>(promiseId: string, arg: ReturnType<WindowCallbackApi[T]>): void;
}

// type safe api
export interface PreloadedApi extends WindowSenderProtocol, WindowReceiverProtocol {
  getModels(provider: TProvider): Promise<string>
  
  getMachineName(): Promise<string>
  
  setOpenAiConfiguration(config: OpenAiConfiguration): Promise<void>
  
  streamedChat(conversation: Conversation): Promise<void>
  
  continuePlan(conversation: Conversation): Promise<ApiCallPlan>
}
