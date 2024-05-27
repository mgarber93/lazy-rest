import {container, injectable} from 'tsyringe'
import {Handler} from './handler'
import {Conversation, Plan} from '../../models/conversation'
import {OpenAiLlm} from '../providers/openai'

@injectable()
export class ResultInterpreter implements Handler<'interpretResult'> {
  private openAiLlm = container.resolve(OpenAiLlm)
  async handle(conversation: Conversation): Promise<Plan> {
    const {result} = conversation.planController
    return conversation.planController
  }
}
