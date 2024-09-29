import {TProvider} from '../../models/responder'
import {Handler} from './handler'
import {container} from 'tsyringe'
import {OpenAiProvider} from '../providers/openai'

export class ModelListHandle implements Handler<'getModels'> {
  private openAiLlm: OpenAiProvider = container.resolve(OpenAiProvider)
  
  async handle(provider: TProvider) {
    console.log('GetModelsHandler:handle', provider)
    switch (provider) {
      case "openai": {
        return this.openAiLlm.list()
      }
      default: {
        throw new Error('not implemented')
      }
    }
  }
}
