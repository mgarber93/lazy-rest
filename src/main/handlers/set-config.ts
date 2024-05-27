import {OpenAiConfiguration} from '../../models/provider-config'
import windowSender from '../../main/utils/window-sender'
import {HttpRequestPlan} from '../../models/http-request-plan'
import {approveCallingPlan, get} from '../tools/http'
import {Handler} from './handler'
import {container, singleton} from 'tsyringe'
import {ConfigurationManager} from '../providers/configuration-manager'

@singleton()
export class OpenAiConfigHandler implements Handler<'setOpenAiConfiguration'> {
  private configManager = container.resolve(ConfigurationManager)
  async handle(config: OpenAiConfiguration): Promise<void> {
    this.configManager.setOpenAiConfig(config)
  }
}

export class CallbackHandler implements Handler<'callback'> {
  async handle(id: string, arg: any) {
    return windowSender.callback(id, arg)
  }
}


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
