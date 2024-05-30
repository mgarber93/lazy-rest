import {container, singleton} from 'tsyringe'
import {Model} from '../../models/responder'
import {AuthoredContent} from '../../models/content'
import {buildCallerPrompt} from '../../prompts/api-caller'
import {AgentFactory} from './agent-factory'
import {Plan} from '../../models/conversation'
import {OpenApiSpec} from '../../models/open-api-spec'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {oasToDescriptions} from '../utils/oas-filter'

@singleton()
export class ExecutorFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-4-turbo-preview",
  } as Model
  
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)

  specToOas(spec: OpenApiSpec): string {
    return JSON.stringify(oasToDescriptions(spec), null, 2)
  }

  async createArgs() {
    const oasSpec = await this.mainWindowCallbackConsumer.loadAllOas()
    const endpoints = oasSpec.reduce((acc: string, spec: OpenApiSpec) => acc + this.specToOas(spec), '')
    return {
      endpoints,
      oasSpec,
    }
  }
  
  create(plan: Plan) {
    const {userGoal} = plan
    return this.createAgent(userGoal, buildCallerPrompt(userGoal.message, endpoints))
  }
}