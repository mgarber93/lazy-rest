import OpenAI, {ClientOptions} from 'openai'
import {container, singleton} from 'tsyringe'
import {AsyncWindowSenderApi} from '../async-window-sender-api'


// manages provider config and high level llm queries like get fast, get cheap, etc
@singleton()
export class ConfigurationManager {
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  private openAiConfig: unknown
  
  async getOpenAi() {
    if (!this.openAiConfig) {
      const config = await this.mainWindowCallbackConsumer.getProviderConfig()
      this.openAiConfig = config.openAi
    }
    return new OpenAI(this.openAiConfig as ClientOptions)
  }
  
  setOpenAiConfig(openAiConfig: ClientOptions): void {
    this.openAiConfig = openAiConfig
  }
}
