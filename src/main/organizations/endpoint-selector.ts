import {container, singleton} from 'tsyringe'
import {SelectorFactory} from '../agents/selector-factory'

@singleton()
export class EndpointSelector {
  private agentFactory = container.resolve(SelectorFactory)
  
}
