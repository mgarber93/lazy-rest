import {HttpRequestPlan} from '../models/http-request-plan'
import {AuthoredContent} from '../models/content'
import {OpenApiSpec} from '../models/open-api-spec'
import {Approvable, ApprovalResponse} from '../models/approvable'

export type TWindowSenderChannel = keyof WindowCallbackApi

/**
 * Channels preloader will allow at runtime
 */
export const channelAllowList: TWindowSenderChannel[] = [
  'appendContentDelta',
  'loadAllOas',
  'setCallingPlan',
  'respondTo',
  'requestApproval'
]

/**
 * Declare the api provided by a window to the main process using the WindowSender callback
 * protocol, implemented by Provider. WindowSender makes the return type a promise
 */
export interface WindowCallbackApi {
  appendContentDelta(authoredContentDelta: {chatId: string, messageId: string, delta: string, closed: boolean}): void;
  
  loadAllOas(): OpenApiSpec[];

  setCallingPlan(chatId: string, calls: HttpRequestPlan[]): void;
  
  respondTo(chatId: string, author: string): AuthoredContent;
  
  requestApproval(approval: Approvable, api: string): ApprovalResponse
}
