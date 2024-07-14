import {container, singleton} from 'tsyringe'

import {SelectorFactory} from '../agents/selector-factory'
import {AgentFactory} from '../agents/agent-factory'
import {Conversation, Plan} from '../../models/conversation'


@singleton()
export class EndpointSelector extends AgentFactory {
  public create(plan: Plan): Promise<Conversation> {
    throw new Error('Method not implemented.')
  }
  
  private agentFactory = container.resolve(SelectorFactory)
}
