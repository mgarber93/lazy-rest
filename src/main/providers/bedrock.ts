import {container, injectable} from 'tsyringe'
import {InvokeModelCommand, ListAsyncInvokesCommand} from '@aws-sdk/client-bedrock-runtime'
import {ConfigurationManager} from './configuration-manager'
import {PromptableProvider} from './promptable-provider'
import {AuthoredContent} from '../../models/content'
import {AsyncWindowSenderApi} from '../async-window-sender-api'

@injectable()
export class BedrockProvider implements PromptableProvider {
  private configManager = container.resolve(ConfigurationManager)
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  
  async invoke(command: InvokeModelCommand) {
    const client = await this.configManager.getBedrock()
    if (!client) {
      await this.mainWindowCallbackConsumer.notify('set bedrock config to invoke')
      return
    }
    return client.send(command)
  }
  
  async list(): Promise<string[]> {
    const client = await this.configManager.getBedrock()
    if (!client) {
      return []
    }
    const models = await client.send(new ListAsyncInvokesCommand())
    return models.asyncInvokeSummaries
      ?.map(model => model.modelArn)
      .filter(s => s !== undefined) ?? []
  }
  
  async streamedPrompt(model: string, content: AuthoredContent[], chatId: string, messageId: string): Promise<AuthoredContent[]> {
    const messages = content.map(c => ({
      role: c.role,
      content: c.message,
    }))
    
    const command = new InvokeModelCommand({
      modelId: model,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        prompt: JSON.stringify(messages),
        max_tokens: 1000,
        temperature: 0.7,
        stop_sequences: ["\n\n"],
      }),
    })
    
    const response = await this.invoke(command)
    if (!response) {
      return content
    }
    const responseText = new TextDecoder().decode(response.body)
    const responseJson = JSON.parse(responseText)
    const delta = responseJson.completion
    await this.mainWindowCallbackConsumer.appendContentDelta({delta, chatId, messageId})
    content.push({
      id: messageId,
      chatId,
      message: delta,
      author: model,
      role: 'assistant',
    })
    return content
  }
}
