import {container, singleton} from 'tsyringe'

import {PlannerFactory} from '../agents/planner-factory'
import {Conversation, Plan, PlanStep} from '../../models/conversation'
import {AuthoredContent} from '../../models/content'

@singleton()
export class SwaggerGpt {
  private plannerFactory = container.resolve(PlannerFactory)
  
  private createPlan(userGoal: AuthoredContent) {
    return {
      userGoal,
      state: {},
      steps: [] as PlanStep[],
      step: 0,
    } satisfies Plan
  }
  
  async continue(conversation: Conversation) {
    const lastMessage = conversation.content.at(-1)
    if (!lastMessage)
      throw new Error('unable to continue empty conversation')
    const plan = this.createPlan(lastMessage)
    const {result, agent} = await this.plannerFactory.createAndPrompt(conversation, plan)
    // do something like create network call plan
    // step 1 decide rough sketch of calling plan
    // step 2 create specific network call
    // step 3 interpret results
    // proceed to next in plan for 2 or return to 4
    // step 4 interpret final result (or all results)
  }
}
