import {TAgent} from './organization'
import {Model, TProvider} from '../models/responder'

export function dynamicallyPickResponder(agent: TAgent): Model {
  const defaultResponder = {
    type: 'chat',
    provider: "openai" as TProvider,
    model: "gpt-3.5-turbo"
  } as Model
  switch (agent) {
    case "planner": {
      return defaultResponder
    }
    case "selector": {
      return {
        type: 'chat',
        provider: "openai" as TProvider,
        model: "gpt-4-turbo-preview"
      }
    }
    default: {
      return defaultResponder
    }
  }
}