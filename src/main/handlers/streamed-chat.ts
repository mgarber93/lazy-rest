import {container, injectable} from 'tsyringe'
import {isModel} from '../../models/responder'
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
    
    throw new Error(`Cant respond`)
  }
}
