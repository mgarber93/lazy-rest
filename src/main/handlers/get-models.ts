import {TProvider} from '../../models/responder'
import {Handler} from './handler'
import {container} from 'tsyringe'
import {OpenAiLlm} from '../providers/openai'

export class ModelListHandle implements Handler<'getModels'> {
  private openAiLlm: OpenAiLlm = container.resolve(OpenAiLlm)
  
  async handle(provider: TProvider) {
    console.log('GetModelsHandler:handle')
    switch (provider) {
      case "openai": {
        return this.openAiLlm.getFavorite()
      }
      case "anthropic": {
        throw new Error('not implemented')
      }
    }
  }
}
