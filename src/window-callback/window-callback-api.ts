import {HttpRequestPlan} from '../models/http-request-plan'
import {AuthoredContent} from '../models/content'
import {OpenApiSpec} from '../models/open-api-spec'

export type TWindowSenderChannel = keyof WindowCallbackApi

/**
 * Channels preloader will allow at runtime
 */
export const channelAllowList: TWindowSenderChannel[] = [
  'messageDelta',
  'loadAllOas',
  'presentCallingPlan',
  'respondTo',
]

/**
 * Declare the api provided by a window to the main process using the WindowSender callback
 * protocol, implemented by Provider. WindowSender makes the return type a promise
 */
export interface WindowCallbackApi {
  messageDelta(authoredContentDelta: any): void;
  
  loadAllOas(): OpenApiSpec[];

  presentCallingPlan(chatId: string, calls: HttpRequestPlan[]): void;
  
  respondTo(chatId: string): AuthoredContent;
}
