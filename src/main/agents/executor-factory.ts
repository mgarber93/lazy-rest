import {container, singleton} from 'tsyringe'
import {Model} from '../../models/responder'
import {buildCallerPrompt} from '../../prompts/api-caller'
import {AgentFactory} from './agent-factory'
import {Plan} from '../../models/conversation'
import {OpenApiSpec} from '../../models/open-api-spec'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {oasToDescriptions} from '../utils/oas-filter'
import {StreamedChatHandler} from '../handlers/streamed-chat'

@singleton()
export class OpenApiSpecProvider {
}

@singleton()
export class ExecutorFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-4-turbo-preview",
  } as Model
  
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  private apiProvider = container.resolve(StreamedChatHandler)

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
    const {userGoal, steps, step} = plan
    const currentStep = this.getCurrentStep(plan)
    const getCurrentStep = await this.mainWindowCallbackConsumer.getOas(currentStep.apiId)
    return this.createAgent(userGoal, buildCallerPrompt(userGoal.message))
  }
}
