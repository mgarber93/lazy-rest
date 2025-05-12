import OpenAI, {ClientOptions} from 'openai'
import {container, singleton} from 'tsyringe'
import {BedrockClient} from '@aws-sdk/client-bedrock'
import {BedrockRuntimeClient} from '@aws-sdk/client-bedrock-runtime'

import {AsyncWindowSenderApi} from '../async-window-sender-api'

@singleton()
export class ConfigurationManager {
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  
  async getOpenAi() {
    const config = await this.mainWindowCallbackConsumer.getProviderConfig()
    if (!config.openAi) {
      throw new Error('OpenAI config not found')
    }
    return new OpenAI(config.openAi as ClientOptions)
  }
  
  async getBedrockManagementClient() {
    const config = await this.mainWindowCallbackConsumer.getProviderConfig()
    if (!config.bedrock) {
      throw new Error('Bedrock config not found')
    }
    const {region, secretAccessKey, accessKeyId, sessionToken} = config.bedrock
    return new BedrockClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
        sessionToken,
      },
    })
  }
  
  async getBedrockRuntimeClient() {
    const config = await this.mainWindowCallbackConsumer.getProviderConfig()
    if (!config.bedrock) {
      throw new Error('Bedrock config not found')
    }
    const {region, secretAccessKey, accessKeyId, sessionToken} = config.bedrock
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
