import {OpenAPI} from 'openapi-types'
import {container, singleton} from 'tsyringe'
import {PlannerFactory} from '../agents/planner-factory'
import {Conversation} from '../../models/conversation'
import {AuthoredContent} from '../../models/content'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {oasToDescriptions} from '../utils/oas-filter'
import {ApiCallPlan, PlanStep} from './models'
import {v4} from 'uuid'


@singleton()
export class SwaggerGpt {
  private plannerFactory = container.resolve(PlannerFactory)
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  
  private async createPlan(userGoal: string) {
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
  async continue({content, id, responder}: Conversation) {
    const lastMessage = content.at(-1)
    if (!lastMessage)
      throw new Error('unable to continue empty conversation')
    
    const apiCallPlan = await this.createPlan(lastMessage.message)
    const plan = {
      id: v4(),
      chatId: id,
      author: responder?.model ?? 'gpt-4o',
      role: 'assistant',
      message: '',
      apiCallPlan,
    } satisfies AuthoredContent
    const {result, agent, steps} = await this.plannerFactory.createAndPrompt(apiCallPlan)
    
    await this.mainWindowCallbackConsumer.appendContent(plan)
    // const plan = await this.createPlan(lastMessage)
    // // we now have a high level plan to present to the user in a progress stepper (if verbose)
    // while (plan.step < plan.steps.length) {
    //   // detail the step in the plan given the api it corresponds to
    //   const endpointResult = this.endpointSelector.createAndPrompt(conversation, plan)
    //   // prompt user to execute (if verbose)
    //   // show user results & interpret (if verbose)
    // }
    // return interpretation of final result
  }
}
