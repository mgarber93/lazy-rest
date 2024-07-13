import {container, singleton} from 'tsyringe'
import {Conversation} from '../../models/conversation'
import {ResultInterpreter} from './result-interpreter'
import {EndpointSelector} from './endpoint-selector'
import {AuthoredContent} from '../../models/content'

@singleton()
export class SwaggerGptPlanProgressor {
  private endpointSelector = container.resolve(EndpointSelector)
  private resultInterpreter = container.resolve(ResultInterpreter)
  
  private createPlan(userGoal: AuthoredContent) {
    return {
      userGoal,
      state: {},
      steps: [],
      step: 0,
    }
  }
  
  async continue(conversation: Conversation) {
    const plan = this.createPlan(conversation.content.at(-1))
    
  }
}
