export type TResponder = "chat" | "agent" | "organization"
export type TProvider = "openai" | "anthropic" | "ollama"

export type TModel = "gpt-4-turbo-preview" | "gpt-4o-mini" | "gpt-4o"

export type Responder = {
  type: TResponder;
  provider: TProvider;
  model: TModel;
  responding?: boolean;
}

export function createModelResponder(type: TResponder, model: TModel, provider: TProvider): Responder {
  return {
    type,
    model,
    provider,
  }
}

export function getRespondingModel(responder: Responder): string {
  return (responder as Responder)?.model
}

export function isModel(responder: Responder): responder is Responder {
  return responder.type === 'chat'
}

export function isOrganization(responder: Responder): responder is Responder {
  return responder.type === 'organization'
}
