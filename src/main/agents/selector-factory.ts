import {singleton} from 'tsyringe'
import {Model} from '../../models/responder'
import {AgentFactory} from './agent-factory'
import {Conversation, Plan} from '../../models/conversation'

@singleton()
export class SelectorFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-4-turbo-preview",
  } as Model
  
  async create(plan: Plan): Promise<Conversation> {
    const {userGoal} = plan
    throw new Error('not implemented')
  }
}
