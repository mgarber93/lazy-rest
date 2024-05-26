import {IpcMainInvokeEvent} from 'electron'
import {container, injectable} from 'tsyringe'

import {GetModels, TProvider} from '../../models/responder'
import {getModels as listOpenAiModels} from '../providers/openai'
import {TInvokeChannel} from '../../preloaded/preloaded-api'

export interface PreloadedApiHandler<T extends (...args: any[]) => any> {
  channel: TInvokeChannel
  handle: (event: IpcMainInvokeEvent, ...args: Parameters<T>) => ReturnType<T>
}


// main side handler
@injectable()
export class GetModelsHandler implements PreloadedApiHandler<GetModels> {
  channel = 'getModels' as TInvokeChannel
  
  async handle(event: IpcMainInvokeEvent, provider: TProvider) {
    console.log('GetModelsHandler:handle')
    switch (provider) {
      case "openai": {
        return listOpenAiModels()
      }
      case "anthropic": {
        throw new Error('not implemented')
      }
    }
  }
}


container.register<GetModelsHandler>(GetModelsHandler, {useClass: GetModelsHandler})
