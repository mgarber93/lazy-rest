import {container, injectable} from 'tsyringe'
import {WindowCallbackApi} from '../window-callback/window-callback-api'
import {WindowSender} from './utils/window-sender'
import {HttpRequestPlan} from '../models/http-request-plan'
import {AuthoredContent} from '../models/content'
import {OpenApiSpec} from '../models/open-api-spec'

export type Promisify<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer Result ? (...args: Args) => Promise<Result> : never;
}

@injectable()
export class MainWindowCallbackConsumer implements Promisify<WindowCallbackApi> {
  private windowSender = container.resolve(WindowSender)
  
  async callback(id: string, arg: never): Promise<void> {
    this.windowSender.callback(id, arg)
  }
  
  messageDelta(authoredContentDelta: any): Promise<void> {
    throw new Error('Method not implemented.')
  }
  
  async loadAllOas(): Promise<OpenApiSpec[]> {
    try {
      const response = await this.windowSender.asyncSend("loadAllOas")
      return response
    } catch (error) {
      console.error(error)
    }  }
  
  async presentCallingPlan(chatId: string, calls: HttpRequestPlan[]): Promise<void> {
    this.windowSender.asyncSend('presentCallingPlan', chatId, calls)
  }
  
  async respondTo(chatId: string): Promise<AuthoredContent> {
    const content = await this.windowSender.asyncSend('respondTo', chatId)
    return content
  }
}
