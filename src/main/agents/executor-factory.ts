import {container, singleton} from 'tsyringe'
import {OpenAPI} from 'openapi-types'

import {buildCallerPrompt} from '../../prompts/api-caller'
import {AgentFactory} from './agent-factory'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {oasToDescriptions} from '../utils/oas-filter'
import {StreamedChatHandler} from '../handlers/streamed-chat'
import {Responder} from '../../models/responder'
import {ApiCallPlan} from '../organizations/models'

@singleton()
export class ExecutorFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-4-turbo-preview",
  } satisfies Responder
  
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  private apiProvider = container.resolve(StreamedChatHandler)
  private agentFactory = container.resolve(AgentFactory)
 
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
  
  protected getCurrentStep(plan: ApiCallPlan) {
    const {steps, step} = plan
    return steps.at(step)
  }
  
  async create(plan: ApiCallPlan) {
    const {userGoal, steps, step} = plan
    const currentStep = this.getCurrentStep(plan)
    if (!currentStep || !userGoal) {
      throw new Error('Invalid plan')
    }
    
    // const getCurrentStep = await this.mainWindowCallbackConsumer.getOas(currentStep.apiId)
    // const apiDocs = await this.mainWindowCallbackConsumer.getOas()
    const spec = plan.oasSpec.at(0) ?? null
    return this.agentFactory.createAgent(userGoal, buildCallerPrompt(userGoal, spec), this.model)
  }
}
