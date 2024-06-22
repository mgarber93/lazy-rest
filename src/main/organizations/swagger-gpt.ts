import {container, singleton} from 'tsyringe'
import {Conversation} from '../../models/conversation'
import {ResultInterpreter} from './result-interpreter'

@singleton()
export class SwaggerGptPlanProgressor {
  private resultInterpreter = container.resolve(ResultInterpreter)
  
  async continue(conversation: Conversation) {
    throw new Error('not implemented')
  }
  
  start() {
    throw new Error('not implemented')
  }
}
