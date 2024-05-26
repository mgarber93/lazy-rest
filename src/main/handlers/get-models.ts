import {TProvider} from '../../models/responder'
import {getModels} from '../providers/openai'

export async function handle(provider: TProvider) {
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


