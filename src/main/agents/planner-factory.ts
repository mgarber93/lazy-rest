import {singleton} from 'tsyringe'
import {Model} from '../../models/responder'
import {plannerTemplate} from '../../prompts/rest-gpt/planner'
import {AgentFactory} from './agent-factory'
import {Plan} from '../../models/conversation'

@singleton()
export class PlannerFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-3.5-turbo",
  } as Model
  
  async create(plan: Plan) {
    return this.createAgent(plan.userGoal, plannerTemplate)
  }
}
