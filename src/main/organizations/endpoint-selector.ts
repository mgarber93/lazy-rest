import {container, singleton} from 'tsyringe'
import {SelectorFactory} from '../agents/selector-factory'
import {Plan} from '../../models/conversation'
import {AuthoredContent} from '../../models/content'

@singleton()
export class EndpointSelector {
  private agentFactory = container.resolve(SelectorFactory)
  
  async createCallingPlan(userGoal: AuthoredContent): Promise<Plan> {
  }
}
