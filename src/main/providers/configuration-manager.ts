import {OpenAiConfiguration} from '../../models/provider-config'
import OpenAI from 'openai'
import {singleton} from 'tsyringe'


// manages provider config and high level llm queries like get fast, get cheap, etc
@singleton()
export class ConfigurationManager {
  openAiConfig: OpenAiConfiguration | null = null
  
  getOpenAi() {
    // todo request from windowSender?
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
