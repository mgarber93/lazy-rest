import {TProvider} from '../../models/responder'
import {Handler} from './handler'
import {container} from 'tsyringe'
import {OpenAiProvider} from '../providers/openai'
import {OllamaProvider} from '../providers/ollama'
import {BedrockProvider} from '../providers/bedrock'

export class ModelListHandle implements Handler<'getModels'> {
  private openAiLlm: OpenAiProvider = container.resolve(OpenAiProvider)
  private ollama = container.resolve(OllamaProvider)
  private bedrock = container.resolve(BedrockProvider)

  async handle(provider: TProvider) {
    console.log('GetModelsHandler:handle', provider)
    switch (provider) {
      case "openai": {
        return this.openAiLlm.list()
      }
      case "ollama": {
        return this.ollama.list()
      }
      case "bedrock": {
        return this.bedrock.list()
      }
      default: {
        throw new Error('not implemented')
      }
    }
  }
}
