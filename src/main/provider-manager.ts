import {OpenAiConfiguration} from '../models/provider-config'
import OpenAI from 'openai'

// manages provider config and high level llm queries like get fast, get cheap, etc
export class ProviderManager {
  openAiConfig: OpenAiConfiguration | null = null
  
  getOpenAi() {
    if (!this.openAiConfig) {
      throw new Error('Not configured for openai!')
    }
    const {baseUrl, apiKey} = this.openAiConfig
    return new OpenAI({baseURL: baseUrl, apiKey})
  }
  
  setOpenAiConfig(openAiConfig: OpenAiConfiguration): void {
    this.openAiConfig = openAiConfig
  }
}


export default new ProviderManager()