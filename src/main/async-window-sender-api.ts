import {container, injectable} from 'tsyringe'
import {WindowSender} from './utils/window-sender'
import {AuthoredContent, ContentDelta} from '../models/content'
import {OpenAPI} from 'openapi-types'
import {WindowCallbackApi} from '../window-callback/window-callback-api'


export type Promisify<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer Result ? (...args: Args) => Promise<Result> : never;
}

@injectable()
export class AsyncWindowSenderApi implements Promisify<WindowCallbackApi> {
  private windowSender = container.resolve(WindowSender)
  
  async callback(id: string, arg: never): Promise<void> {
    this.windowSender.callback(id, arg)
  }
  
  async appendContentDelta({chatId, messageId, delta}: ContentDelta): Promise<void> {
    process.stdout.write(delta)
    await this.windowSender.asyncSend('appendContentDelta', {delta, chatId, messageId})
  }
  
  loadAllOas(): Promise<OpenAPI.Document[]> {
    return this.windowSender.asyncSend("loadAllOas")
  }
  
  async addNewResponse(chatId: string, author: string): Promise<AuthoredContent> {
    const content = await this.windowSender.asyncSend('addNewResponse', chatId, author)
    return content as AuthoredContent
  }
  
  async getOas(oasId: string): Promise<OpenAPI.Document | undefined> {
    const oas = await this.windowSender.asyncSend('getOas', {oasId})
    return oas as OpenAPI.Document | undefined
  }
}
