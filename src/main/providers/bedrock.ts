import {container, injectable} from 'tsyringe'
import {InvokeModelCommand} from '@aws-sdk/client-bedrock-runtime'
import {ListFoundationModelsCommand} from '@aws-sdk/client-bedrock'

import {ConfigurationManager} from './configuration-manager'
import {PromptableProvider} from './promptable-provider'
import {AuthoredContent} from '../../models/content'
import {AsyncWindowSenderApi} from '../async-window-sender-api'

@injectable()
export class BedrockProvider implements PromptableProvider {
  private configManager = container.resolve(ConfigurationManager)
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  
  private async invoke(command: InvokeModelCommand) {
    const client = await this.configManager.getBedrockRuntimeClient()
    if (!client) {
      await this.mainWindowCallbackConsumer.notify('set bedrock config to invoke')
      return
    }
    return client.send(command)
  }
  
  async list(): Promise<string[]> {
    const mgmt = await this.configManager.getBedrockManagementClient()
    if (!mgmt) {return []}
    try {
      const res = await mgmt.send(
        new ListFoundationModelsCommand({byInferenceType: 'ON_DEMAND'}),
      )
      return res.modelSummaries?.map(m => m.modelId ?? '') ?? []
    } catch (e) {
      console.error(e)
      return []
    }
  }

  private buildCommandPayload(
    model: string,
    messages: { role: string; content: string }[],
  ) {
    // ---------- Amazon Nova (chat) ----------
    if (model.startsWith('amazon.nova')) {
      const novaMessages = messages.map((m) => ({
        role: m.role,
        content: [{ text: m.content }],
      }))

      return {
        modelId: model,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          messages: novaMessages,
          inferenceConfig: {
            maxTokens: 512,
            temperature: 0.7,
            topP: 0.9,
          },
        }),
      }
    }

    // ---------- Amazon Titan ----------
    if (model.startsWith('amazon.')) {
      return {
        modelId: model,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          inputText: messages[messages.length - 1].content,
          textGenerationConfig: {
            maxTokenCount: 512,
            temperature: 0.7,
            topP: 0.9,
            stopSequences: [],
          },
        }),
      }
    }

    // ---------- Anthropic Claude ----------
    if (model.startsWith('anthropic.')) {
      const claudeMessages = messages.map((m) => ({
        role: m.role,
        content: [{ type: 'text', text: m.content }],
      }))

      return {
        modelId: model,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 512,
          messages: claudeMessages,
        }),
      }
    }

    // ---------- Fallback ----------
    return {
      modelId: model,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({ messages }),
    }
  }
  
  async streamedPrompt(model: string, content: AuthoredContent[], chatId: string, messageId: string): Promise<AuthoredContent[]> {
    const messages = content.map(c => ({
      role: c.role,
      content: c.message,
    }))
    
    const command = new InvokeModelCommand(this.buildCommandPayload(model, messages))
    const response = await this.invoke(command)
    if (!response) {
      return content
    }
    const responseText = new TextDecoder().decode(response.body)
    const responseJson = JSON.parse(responseText)
    let delta: string | undefined

    if (model.startsWith('amazon.nova')) {
      delta =
        (responseJson?.output?.message?.content?.[0]?.text as string) ??
        (responseJson?.content?.[0]?.text as string)
    } else if (model.startsWith('amazon.')) {
      delta =
        (responseJson?.results?.[0]?.outputText as string) ??
        (responseJson?.outputText as string)
    } else if (model.startsWith('anthropic.')) {
      delta =
        (responseJson?.output?.message?.content?.[0]?.text as string) ??
        (responseJson?.content?.[0]?.text as string)
    }

    if (!delta) {
      // Fallback for unknown providers or future schemas
      delta = responseJson.completion ?? ''
    }
    if (!delta) {
      return content
    }
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
