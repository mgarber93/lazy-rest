import {container, singleton} from 'tsyringe'
import {ChatCompletionMessageParam} from 'openai/resources'
import {OpenAiProvider} from './openai'
import {Responder, TProvider} from '../../models/responder'
import {HttpRequestPlan} from '../../models/api-call-plan'

@singleton()
export class ResponseFactory {
  private openAiProvider = container.resolve(OpenAiProvider)
  
  private fuzzyFix(activities: HttpRequestPlan[]): HttpRequestPlan[] {
    if (!Array.isArray(activities) && activities) {
      if ('steps' in activities) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return activities.steps
      }
      if ('plan' in activities) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return activities.plan
      }
    }
    return activities ?? []
  }
  
  async promptAndParseJson(provider: TProvider, prompt: string): Promise<HttpRequestPlan[]> {
    switch (provider) {
      case "openai": {
        const result = await this.openAiProvider.promptAndParseJson<HttpRequestPlan[]>('gpt-4o-mini', [{
          role: 'user',
          content: prompt,
        }])
        return this.fuzzyFix(result)
      }
      default: {
        throw new Error('not implemented')
      }
    }
  }
  
  async prompt(responder: Responder, content: ChatCompletionMessageParam[], convoId: string, responseId: string) {
    if (responder.provider === 'openai') {
      await this.openAiProvider.streamFromPrompt(responder.model, content, convoId, responseId)
    } else {
      throw new Error('not implemented')
    }
  }
}
