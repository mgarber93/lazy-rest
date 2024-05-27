import {ChatCompletionMessageParam} from 'openai/resources'
import {AuthoredContent, ContentDelta, createContent, isToolCall} from '../../models/content'
import windowSender from '../utils/window-sender'
import {RoleContent} from '../tools/api'
import {container, injectable} from 'tsyringe'
import {ConfigurationManager} from './configuration-manager'

@injectable()
export class OpenAiLlm {
  private manager = container.resolve(ConfigurationManager)
   async listOpenAiModels() {
    const openai = this.manager.getOpenAi()
    const models = await openai.models.list()
    return models.data
      .filter(item => item.object === 'model' && item.id.startsWith('gpt'))
      .map(item => item.id)
      .join(',')
  }
  
  // https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
  async getFavorite() {
    return ['gpt-3.5-turbo', 'gpt-4o', 'gpt-4-turbo-preview'].join(',')
  }
  
  async prompt(model: string, content: AuthoredContent[]): Promise<RoleContent> {
    const messages = content
      .map(mapAuthoredContentToChatCompletion)
    const openai = this.manager.getOpenAi()
    const chatCompletion = await openai.chat.completions.create({
      model,
      messages,
    })
    return chatCompletion.choices[0].message
  }
  
  async streamedPrompt(model: string, content: AuthoredContent[], chatId: string, messageId: string): Promise<AuthoredContent[]> {
    const messages = content
      .map(mapAuthoredContentToChatCompletion)
    const openai = this.manager.getOpenAi()
    const stream = await openai.chat.completions.create({
      model,
      messages: messages,
      stream: true,
    })
    const responseContent = createContent('', chatId, model, 'assistant')
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || ""
      responseContent.message += delta
      process.stdout.write(delta)
      windowSender.send('message-delta', {delta, chatId, messageId} as ContentDelta)
    }
    windowSender.send('message-delta', {delta: '', chatId, messageId, closed: true})
    content.push(responseContent)
    return content
  }
  
  async agentWithHttp(model: string, messages: ChatCompletionMessageParam[]) {
    const openai = this.manager.getOpenAi()
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
