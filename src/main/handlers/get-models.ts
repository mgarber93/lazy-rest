import {TProvider} from '../../models/responder'
import {getModels} from '../providers/openai'
import {Handler} from './handler'

export class ModelListHandle implements Handler<'getModels'> {
  async handle(provider: TProvider) {
    console.log('GetModelsHandler:handle')
    switch (provider) {
      case "openai": {
        return getModels()
      }
      case "anthropic": {
        throw new Error('not implemented')
      }
    }
  }
}