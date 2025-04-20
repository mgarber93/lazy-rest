import {ChatCompletionMessageParam} from 'openai/resources'
import {AuthoredContent, createContent, isToolCall} from '../../models/content'
import {container, injectable} from 'tsyringe'
import {ConfigurationManager} from './configuration-manager'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {PromptableProvider} from './promptable-provider'

@injectable()
export class OpenAiProvider implements PromptableProvider {
  private manager = container.resolve(ConfigurationManager)
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  
  // https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
  async list() {
    const openai = await this.manager.getOpenAi()
    const models = await openai.models.list()
    console.log(models.data)
    return models.data
      .filter(item => item.object === 'model' && item.id.startsWith('gpt') || item.id.startsWith('o'))
      .map(item => item.id)
  }
  
  async prompt(model: string, content: AuthoredContent[]): Promise<RoleContent> {
    const messages = content
      .map(mapAuthoredContentToChatCompletion)
    const openai = await this.manager.getOpenAi()
    const chatCompletion = await openai.chat.completions.create({
      model,
      messages,
    })
    const message = chatCompletion.choices[0].message
    return {
      content: message.content ?? '',
      role: message.role,
    } satisfies RoleContent
  }
  
  async promptAndParseJson<T extends object>(model: string, messages: ChatCompletionMessageParam[]): Promise<T> {
    const openai = await this.manager.getOpenAi()
    const chatCompletion = await openai.chat.completions.create({
      model,
      messages: messages,
      response_format: { type: 'json_object' },
    })
    const message = chatCompletion.choices[0].message
    
    let parsedContent = {}
    if (!message.content) {
      throw new Error("No content in message")
    }
    try {
      parsedContent = JSON.parse(message.content)
      return parsedContent as T
    } catch (error) {
      throw new Error("Failed to parse message content as JSON: " + error.message)
    }
  }
  
  async streamFromPrompt(model: string, messages: ChatCompletionMessageParam[], chatId: string, messageId: string): Promise<AuthoredContent> {
    const openai = await this.manager.getOpenAi()
    const stream = await openai.chat.completions.create({
      model,
      messages: messages,
      stream: true,
    })
    const responseContent = createContent('', chatId, model, 'assistant')
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || ""
      responseContent.message += delta
      await this.mainWindowCallbackConsumer.appendContentDelta({delta, chatId, messageId})
    }
    return responseContent
  }
  
  async streamedPrompt(model: string, content: AuthoredContent[], chatId: string, messageId: string): Promise<AuthoredContent[]> {
    const messages = content
      .map(mapAuthoredContentToChatCompletion)
    content.push(await this.streamFromPrompt(model, messages, chatId, messageId))
    return content
  }
  
  async agentWithHttp(model: string, messages: ChatCompletionMessageParam[]) {
    const openai = await this.manager.getOpenAi()
    const result = await openai.chat.completions.create({
      messages,
      model,
      tools: [
        {
          type: 'function',
          function: {
            name: "GET",
            description: "Retrieves data from the server without modifying it.",
            parameters: {
              type: "object",
              properties: {
                endpoint: {
                  type: 'string',
                  description: 'endpoint to call (e.g. /search?customer=123)',
                },
              },
              required: ["endpoint"],
            },
          },
        },
      ],
    })
    return result.choices[0].message
  }
}

export function mapAuthoredContentToChatCompletion(content: AuthoredContent): ChatCompletionMessageParam {
  switch (content.role) {
    case "system":
    case "assistant":
    case "user": {
      return {role: content.role, content: content.message}
    }
    case "tool": {
      if (!isToolCall(content))
        throw new Error(`content isn't a tool call`)
      
      return {
        role: content.role,
        content: content.message,
        tool_call_id: content.tool_call_id,
      }
    }
  }
}

interface ToolParameter {
  type: 'object' | 'string' | 'number';
  enum: string[];
  description: string;
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
}

export interface RoleContent {
  role: "system" | "assistant" | "user",
  content: string
}
