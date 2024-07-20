import {container, singleton} from 'tsyringe'

import {PlannerFactory} from '../agents/planner-factory'
import {Conversation} from '../../models/conversation'
import {AuthoredContent} from '../../models/content'
import {EndpointSelector} from './endpoint-selector'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {OpenAPI} from 'openapi-types'
import {oasToDescriptions} from '../utils/oas-filter'
import {ApiCallPlan, PlanStep} from './api-call-plan'


@singleton()
export class SwaggerGpt {
  private plannerFactory = container.resolve(PlannerFactory)
  private endpointSelector = container.resolve(EndpointSelector)
  
  private async createPlan(userGoal: AuthoredContent) {
    const oasSpec = await this.mainWindowCallbackConsumer.loadAllOas()
    const endpoints = oasSpec.reduce((acc: string, spec: OpenAPI.Document) => acc + this.specToOas(spec), '')
    
    return {
      userGoal,
      state: {},
      steps: [] as PlanStep[],
      step: 0,
      endpoints,
      oasSpec,
    } satisfies ApiCallPlan
  }
  
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  
  specToOas(spec: OpenAPI.Document): string {
    return JSON.stringify(oasToDescriptions(spec), null, 2)
  }
  
  async continue(conversation: Conversation) {
    const lastMessage = conversation.content.at(-1)
    if (!lastMessage)
      throw new Error('unable to continue empty conversation')
    const plan = await this.createPlan(lastMessage)
    const {result, agent} = await this.plannerFactory.createAndPrompt(conversation, plan)
    const endpointResult = this.endpointSelector.createAndPrompt(conversation, plan)
  }
}
