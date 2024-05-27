import {OpenAiConfiguration} from '../../models/provider-config'
import {HttpRequestPlan} from '../../models/http-request-plan'
import {approveCallingPlan, get} from '../tools/http'
import {Handler} from './handler'
import {container, singleton} from 'tsyringe'
import {ConfigurationManager} from '../providers/configuration-manager'
import {MainWindowCallbackConsumer} from '../main-window-callback-consumer'

@singleton()
export class OpenAiConfigHandler implements Handler<'setOpenAiConfiguration'> {
  private configManager = container.resolve(ConfigurationManager)
  async handle(config: OpenAiConfiguration): Promise<void> {
    this.configManager.setOpenAiConfig(config)
  }
}

@singleton()
export class CallbackHandler implements Handler<'callback'> {
  private mainWindowCallbackConsumer = container.resolve(MainWindowCallbackConsumer)
  
  async handle(id: string, arg: never) {
    return this.mainWindowCallbackConsumer.callback(id, arg)
  }
}

@singleton()
export class HttpHandler implements Handler<'httpCall'> {
  async handle(call: HttpRequestPlan) {
    const token = await approveCallingPlan(null)
    
    switch (call.method) {
      case "GET": {
        const response = await get(token, call.path)
        console.log(JSON.stringify(response, null, 2))
        return response
      }
    }
    throw new Error(`Not implemented`)
  }
}
