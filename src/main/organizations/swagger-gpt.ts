import {OpenAPI} from 'openapi-types'
import {container, singleton} from 'tsyringe'
import {PlannerFactory} from '../agents/planner-factory'
import {Conversation} from '../../models/conversation'
import {AuthoredContent} from '../../models/content'
import {EndpointSelector} from './endpoint-selector'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {oasToDescriptions} from '../utils/oas-filter'
import {ApiCallPlan, PlanStep} from './models'


@singleton()
export class SwaggerGpt {
  private plannerFactory = container.resolve(PlannerFactory)
  private endpointSelector = container.resolve(EndpointSelector)
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  
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
  
  specToOas(spec: OpenAPI.Document): string {
    return JSON.stringify(oasToDescriptions(spec), null, 2)
  }
  
  /**
   * @todo this needs to be implemented at a high level
   * when we update the plan, how do we save it to the renderer process?
   * should we even be saving state in the renderer process?
   * @param conversation
   */
  async continue(conversation: Conversation) {
    const lastMessage = conversation.content.at(-1)
    if (!lastMessage)
      throw new Error('unable to continue empty conversation')
    const plan = await this.createPlan(lastMessage)
    const {result, agent} = await this.plannerFactory.createAndPrompt(conversation, plan)
    // we now have a high level plan to present to the user in a progress stepper (if verbose)
    while (plan.step < plan.steps.length) {
      // detail the step in the plan given the api it corresponds to
      const endpointResult = this.endpointSelector.createAndPrompt(conversation, plan)
      // prompt user to execute (if verbose)
      // show user results & interpret (if verbose)
    }
    // return interpretation of final result
  }
}
