import OpenAI, {ClientOptions} from 'openai'
import {container, singleton} from 'tsyringe'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {BedrockRuntimeClient} from '@aws-sdk/client-bedrock-runtime'
import {BedrockConfiguration} from '../../models/api-configuration'


// manages provider config and high level llm queries like get fast, get cheap, etc
@singleton()
export class ConfigurationManager {
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  private openAiConfig: unknown | null = null
  private bedrockConfig: BedrockConfiguration | null = null

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

  async getBedrock() {
    if (!this.bedrockConfig) {
      const config = await this.mainWindowCallbackConsumer.getProviderConfig()
      this.bedrockConfig = config.bedrock
    }
    if (!this.bedrockConfig) {
      return
    }
    const {region, secretAccessKey, accessKeyId, sessionToken} = this.bedrockConfig
    return new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
        sessionToken,
      },
    })
  }
}
