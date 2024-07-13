import {container, singleton} from 'tsyringe'
import {Conversation, Plan, PlanStep} from '../../models/conversation'
import {ResultInterpreter} from './result-interpreter'
import {EndpointSelector} from './endpoint-selector'
import {AuthoredContent} from '../../models/content'

@singleton()
export class SwaggerGptPlanProgressor {
  private endpointSelector = container.resolve(EndpointSelector)
  private resultInterpreter = container.resolve(ResultInterpreter)
  
  private createPlan(userGoal: AuthoredContent) {
    return {
      userGoal,
      state: {},
      steps: [] as PlanStep[],
      step: 0,
    } satisfies Plan
  }
  
  async continue(conversation: Conversation) {
    const plan = this.createPlan(conversation.content.at(-1))
    // step 1 decide rough sketch of calling plan
    // step 2 create specific network call
    // step 3 interpret results
    // proceed to next in plan for 2 or return to 4
    // step 4 interpret final result (or all results)
  }
}
