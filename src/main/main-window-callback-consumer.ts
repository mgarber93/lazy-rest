import {container, injectable} from 'tsyringe'
import {WindowCallbackApi} from '../window-callback/window-callback-api'
import {WindowSender} from './utils/window-sender'
import {AuthoredContent, ContentDelta} from '../models/content'
import {OpenApiSpec} from '../models/open-api-spec'
import {Approvable, ApprovalResponse} from '../models/approvable'
import {HttpRequestPlan} from '../models/http-request-plan'

export type Promisify<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer Result ? (...args: Args) => Promise<Result> : never;
}

@injectable()
export class MainWindowCallbackConsumer implements Promisify<WindowCallbackApi> {
  private windowSender = container.resolve(WindowSender)
  
  async callback(id: string, arg: never): Promise<void> {
    this.windowSender.callback(id, arg)
  }
  
  async appendContentDelta({chatId, messageId, delta}: ContentDelta): Promise<void> {
    process.stdout.write(delta)
    await this.windowSender.asyncSend('appendContentDelta', {delta, chatId, messageId})
  }
  
  loadAllOas(): Promise<OpenApiSpec[]> {
    return this.windowSender.asyncSend("loadAllOas")
  }
  
  requestApproval(approval: Approvable): Promise<ApprovalResponse> {
    return this.windowSender.asyncSend('requestApproval', approval)
  }
  
  async respondTo(chatId: string): Promise<AuthoredContent> {
    const content = await this.windowSender.asyncSend('respondTo', chatId)
    return content
  }
  
  setCallingPlan(chatId: string, calls: HttpRequestPlan[]): Promise<void> {
    return  this.windowSender.asyncSend('setCallingPlan', chatId, calls)
  }
}
