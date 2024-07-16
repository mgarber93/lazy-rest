import {container, injectable} from 'tsyringe'
import {isModel} from '../../models/responder'
import {Conversation} from '../../models/conversation'
import {Handler} from './handler'
import {OpenAiLlm} from '../providers/openai'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {SwaggerGpt} from '../organizations/swagger-gpt'


@injectable()
export class StreamedChatHandler implements Handler<'streamedChat'> {
  private openAiLlm: OpenAiLlm = container.resolve(OpenAiLlm)
  private swaggerGptPlanProgressor = container.resolve(SwaggerGpt)
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  static Error_Message = 'conversation has no model set. did you want to set it or maybe just default to something the user set'
  
  async handle(conversation: Conversation): Promise<void> {
    if (!conversation.responder) {
      throw new Error('No responder set')
    }
    switch (conversation.responder.type) {
      case "chat":
        return this.simpleReply(conversation)
      case "organization":
        return this.organizationReply(conversation)
      case "agent":
      default:
        throw new Error(StreamedChatHandler.Error_Message)
    }
  }
  
  async simpleReply(conversation: Conversation) {
    const {responder} = conversation
    if (!responder || !isModel(responder)) {
      throw new Error(StreamedChatHandler.Error_Message)
    }
    const response = await this.mainWindowCallbackConsumer.addNewResponse(conversation.id, responder.model)
    switch (responder.provider) {
      case "openai": {
        await this.openAiLlm.streamedPrompt(responder.model, conversation.content, conversation.id, response.id)
        return
      }
      case "anthropic": {
        throw new Error('not implemented')
      }
    }
  }
  
  /**
   * An organization reply is a calling plan
   * @param conversation
   */
  async organizationReply(conversation: Conversation) {
    const lastMessage = conversation.content.at(-1)
    return this.swaggerGptPlanProgressor.continue(conversation)
  }
}
