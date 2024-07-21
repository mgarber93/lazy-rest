import {container, singleton} from 'tsyringe'
import {buildCallerPrompt} from '../../prompts/api-caller'
import {AgentFactory} from './agent-factory'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {oasToDescriptions} from '../utils/oas-filter'
import {StreamedChatHandler} from '../handlers/streamed-chat'
import {OpenAPI} from 'openapi-types'
import {Responder} from '../../models/responder'
import {ApiCallPlan} from '../organizations/api-call-plan'

@singleton()
export class ExecutorFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-4-turbo-preview",
  } satisfies Responder
  
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  private apiProvider = container.resolve(StreamedChatHandler)
  
  specToOas(spec: OpenAPI.Document): string {
    return JSON.stringify(oasToDescriptions(spec), null, 2)
  }
  
  async createArgs() {
    const oasSpec = await this.mainWindowCallbackConsumer.loadAllOas()
    const endpoints = oasSpec.reduce((acc: string, spec: OpenAPI.Document) => acc + this.specToOas(spec), '')
    return {
      endpoints,
      oasSpec,
    }
  }
  
  async create(plan: ApiCallPlan) {
    const {userGoal, steps, step} = plan
    const currentStep = this.getCurrentStep(plan)
    if (!currentStep) {
      throw new Error('Invalid plan')
    }
    const getCurrentStep = await this.mainWindowCallbackConsumer.getOas(currentStep.apiId)
    const apiDocs = await this.mainWindowCallbackConsumer.getOas(currentStep.apiId)
    return this.createAgent(userGoal, buildCallerPrompt(userGoal.message, apiDocs))
  }
}
