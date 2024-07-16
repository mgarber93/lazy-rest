import {singleton} from 'tsyringe'
import {plannerTemplate} from '../../prompts/rest-gpt/planner'
import {AgentFactory} from './agent-factory'
import {Plan} from '../../models/conversation'
import {Responder} from '../../models/responder'

@singleton()
export class PlannerFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-3.5-turbo",
  } satisfies Responder
  
  async create(plan: Plan) {
    return this.createAgent(plan.userGoal, plannerTemplate)
  }
}
