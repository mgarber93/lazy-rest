import {injectable} from 'tsyringe'
import {isModel, isOrganization, Model} from '../../models/responder'
import {Conversation} from '../../models/conversation'
import {respondTo} from '../utils/respond-to'
import {streamedPrompt} from '../providers/openai'
import {createCallingPlan} from '../organizations/swagger-gpt'
import {Handler} from './handler'

@injectable()
export class StreamedChatHandler implements Handler<'streamedChat'> {
  async handle(conversation: Conversation): Promise<void> {
    const responder = conversation.responder
    if (isModel(responder)) {
      const response = await respondTo(conversation.id, (conversation.responder as Model).model)
      switch (responder.provider) {
        case "openai": {
          await streamedPrompt(responder.model, conversation.content, conversation.id, response.id)
          return
        }
        case "anthropic": {
          throw new Error('not implemented')
        }
      }
    } else if (isOrganization(responder)) {
      const content = conversation.content
      // assume we're rest GPT for now
      if (content.length < 1)
        throw new Error('No user prompt for org to handle')
      
      const lastMessage = content.at(-1)
      return createCallingPlan(lastMessage, conversation.id)
    }
    
    throw new Error(`Cant respond`)
  }
}
