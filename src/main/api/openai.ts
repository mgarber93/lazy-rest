import {ChatCompletionMessageParam} from 'openai/resources'
import {AuthoredContent, ContentDelta, createContent, isToolCall} from '../../models/content'
import windowSender from '../utils/window-sender'
import providerManager from '../provider-manager'
import {RoleContent} from './api'

// https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
export async function getModels(): Promise<string> {
  return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'].join(',')
  // const models = await openai.models.list();
  // return models.data
  //   .filter(item => item.object === 'model' && item.id.startsWith('gpt'))
  //   .map(item => item.id)
  //   .join(',');
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


export async function prompt(model: string, content: AuthoredContent[]): Promise<RoleContent> {
  const messages = content
    .map(mapAuthoredContentToChatCompletion)
  const openai = providerManager.getOpenAi()
  const chatCompletion = await openai.chat.completions.create({
    model,
    messages,
  })
  return chatCompletion.choices[0].message
}

export async function streamedPrompt(model: string, content: AuthoredContent[], chatId: string, messageId: string): Promise<AuthoredContent[]> {
  const messages = content
    .map(mapAuthoredContentToChatCompletion)
  const openai = providerManager.getOpenAi()
  // @todo replace model when done testing
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
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

interface ToolParameter {
  type: 'object' | 'string' | 'number';
  enum: string[];
  description: string;
}

interface ObjectParameter extends ToolParameter {
  type: 'object';
  required: string[];
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
}

export async function agentWithHttp(model: string, messages: ChatCompletionMessageParam[]) {
  const openai = providerManager.getOpenAi()
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