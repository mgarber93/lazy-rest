import {singleton} from 'tsyringe'
import {Responder} from '../../models/responder'
import {AgentFactory} from './agent-factory'
import {Conversation} from '../../models/conversation'
import {ApiCallPlan} from '../organizations/api-call-plan'

@singleton()
export class SelectorFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-4-turbo-preview",
  } as Responder
  
  async create(plan: ApiCallPlan): Promise<Conversation> {
    const {userGoal} = plan
    throw new Error('not implemented')
  }
}
