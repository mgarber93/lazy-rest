import OpenAI, {ClientOptions} from 'openai';
import {ChatCompletionMessageParam} from 'openai/resources';
import {AuthoredContent, ContentDelta, isToolCall} from '../../models/content';
import windowSender from '../window-sender';


export class OpenAiProvider {
  // https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
  private openai: OpenAI;
  constructor(apiKey: string, baseUrl?: string) {
    const config = {apiKey} as ClientOptions;
    if (baseUrl) {
      config.baseURL = baseUrl
    }
    this.openai = new OpenAI(config);
  }
  async getModels(): Promise<string> {
    return ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'].join(',');
  }
  async testConnection(): Promise<string> {
    const models = await this.openai.models.list();
    return models.data
      .filter(item => item.object === 'model' && item.id.startsWith('gpt'))
      .map(item => item.id)
      .join(',');
  }
  async prompt(model: string, content: AuthoredContent[]): Promise<{
    role: "system" | "assistant" | "user",
    content: string
  }> {
    const messages = content
      .map(mapAuthoredContentToChatCompletion)
    const chatCompletion = await this.openai.chat.completions.create({
      model,
      messages,
    });
    return chatCompletion.choices[0].message;
  }
  async agentWithHttp(model: string, messages: ChatCompletionMessageParam[]) {
    const result = await this.openai.chat.completions.create({
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
    });
    return result.choices[0].message;
  }
  async streamedPrompt(model: string, content: AuthoredContent[], chatId: string, messageId: string): Promise<void> {
    const messages = content
      .map(mapAuthoredContentToChatCompletion)
    const stream = await this.openai.chat.completions.create({
      model,
      messages: messages,
      stream: true,
    });
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      process.stdout.write(delta);
      windowSender.send('message-delta', {delta, chatId, messageId} as ContentDelta)
    }
    windowSender.send('message-delta', {delta: '', chatId, messageId, closed: true});
  }
}

export function mapAuthoredContentToChatCompletion(content: AuthoredContent): ChatCompletionMessageParam {
  switch (content.role) {
    case "system":
    case "assistant":
    case "user": {
      return {role: content.role, content: content.message};
    }
    case "tool": {
      if (!isToolCall(content))
        throw new Error(`content isn't a tool call`);

      return {
        role: content.role,
        content: content.message,
        tool_call_id: content.tool_call_id,
      }
    }
  }
}



