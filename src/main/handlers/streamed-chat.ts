import {container, injectable} from 'tsyringe'
import {isModel, isOrganization, Model} from '../../models/responder'
import {Conversation} from '../../models/conversation'
import {respondTo} from '../utils/respond-to'
import {Handler} from './handler'
import {OpenAiLlm} from '../providers/openai'
import {CallingPlanner} from '../organizations/swagger-gpt'


@injectable()
export class StreamedChatHandler implements Handler<'streamedChat'> {
  private openAiLlm: OpenAiLlm = container.resolve(OpenAiLlm)
  private callingPlanner: CallingPlanner = container.resolve(CallingPlanner)
  
  async handle(conversation: Conversation): Promise<void> {
    const responder = conversation.responder
    if (isModel(responder)) {
      const response = await respondTo(conversation.id, (conversation.responder as Model).model)
      switch (responder.provider) {
        case "openai": {
          await this.openAiLlm.streamedPrompt(responder.model, conversation.content, conversation.id, response.id)
          return
        }
        case "anthropic": {
          throw new Error('not implemented')
        }
      }
    } else if (isOrganization(responder)) {
      const content = conversation.content
      if (content.length < 1)
        throw new Error('No user prompt for org to handle')
      
      throw new Error('not implemented')
      // return this.callingPlanner.createCallingPlan(lastMessage, conversation.id)
    }
    
    throw new Error(`Cant respond`)
  }
}
