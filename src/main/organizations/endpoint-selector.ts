import {container, singleton} from 'tsyringe'

import {SelectorFactory} from '../agents/selector-factory'
import {AgentFactory} from '../agents/agent-factory'
import {Conversation, Plan} from '../../models/conversation'
import {Responder} from '../../models/responder'


@singleton()
export class EndpointSelector extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-3.5-turbo",
  } satisfies Responder

  public create(plan: Plan): Promise<Conversation> {
    throw new Error('Method not implemented.')
  }
  
  private agentFactory = container.resolve(SelectorFactory)
}
