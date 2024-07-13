import {container, singleton} from 'tsyringe'

import {SelectorFactory} from '../agents/selector-factory'
import {AgentFactory} from '../agents/agent-factory'

// @todo refactor agent factory to accept model to create and prompt, if and when subsequent prompting is needed
// lets add methods at that point or something

@singleton()
export class EndpointSelector extends AgentFactory {

  private agentFactory = container.resolve(SelectorFactory)
  
}
