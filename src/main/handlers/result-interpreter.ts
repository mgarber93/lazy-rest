import {injectable} from 'tsyringe'
import {Handler} from './handler'
import {Conversation, Plan} from '../../models/conversation'

@injectable()
export class ResultInterpreter implements Handler<'interpretResult'> {
  async handle(conversation: Conversation): Promise<Plan> {
    return conversation.planController
  }
}
