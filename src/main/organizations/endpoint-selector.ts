import {container, singleton} from 'tsyringe'
import {SelectorFactory} from '../agents/selector-factory'
import {Plan} from '../../models/conversation'

@singleton()
export class EndpointSelector {
  private agentFactory = container.resolve(SelectorFactory)
  
  async createCallingPlan(plan: Plan) {
    // @todo
  }
}