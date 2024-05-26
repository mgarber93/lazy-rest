import {TProvider} from '../../models/responder'
import {listOpenAiModels} from '../../main/providers/openai'

export async function handle(provider: TProvider) {
  console.log('GetModelsHandler:handle')
  switch (provider) {
    case "openai": {
      return listOpenAiModels()
    }
    case "anthropic": {
      throw new Error('not implemented')
    }
  }
}


