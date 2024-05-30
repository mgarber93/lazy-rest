import {container, injectable} from 'tsyringe'
import {isModel, isOrganization} from '../../models/responder'
import {Conversation} from '../../models/conversation'
import {Handler} from './handler'
import {OpenAiLlm} from '../providers/openai'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {EndpointSelector} from '../organizations/endpoint-selector'

@injectable()
export class StreamedChatHandler implements Handler<'streamedChat'> {
  private openAiLlm: OpenAiLlm = container.resolve(OpenAiLlm)
  private callingPlanner: EndpointSelector = container.resolve(EndpointSelector)
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  
  async handle(conversation: Conversation): Promise<void> {
    const responder = conversation.responder
    if (isModel(responder)) {
      const response = await this.mainWindowCallbackConsumer.respondTo(conversation.id, responder.model)
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
      const lastMessage = content.at(-1)
      return this.callingPlanner.createCallingPlan(lastMessage, conversation.id)
    }
    
    throw new Error(`Cant respond`)
  }
}
