import {container, injectable} from 'tsyringe'
import ollama from 'ollama'
import {AuthoredContent, createContent} from '../../models/content'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {PromptableProvider} from './promptable-provider'

/**
 * https://www.npmjs.com/package/ollama
 */
@injectable()
export class OllamaProvider implements PromptableProvider {
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  
  async list() {
    const listed = await ollama.list()
    return listed.models.map(model => model.name)
  }
  
  async streamedPrompt(model: string, content: AuthoredContent[], chatId: string, messageId: string) {
    const messages = content.map(authored => ({role: authored.role, content: authored.message}))
    const response = await ollama.chat({model, messages, stream: true})
    const responseContent = createContent('', chatId, model, 'assistant')
    for await (const chunk of response) {
      responseContent.message += chunk.message.content
      await this.mainWindowCallbackConsumer.appendContentDelta({delta: chunk.message.content, chatId, messageId})
    }
    content.push(responseContent)
    return content
  }
}
