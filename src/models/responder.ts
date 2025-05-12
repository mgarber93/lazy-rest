export type TResponder = "chat" | "agent" | "organization"
export type TProvider = "openai" | "bedrock" | "ollama"

export type TModel = "gpt-4-turbo-preview" | "gpt-4o-mini" | "gpt-4o"

export type Responder = {
  type: TResponder;
  provider: TProvider;
  model: TModel;
  responding?: boolean;
  tools?: string[]; // Array of tool IDs
}

export function createModelResponder(type: TResponder, model: TModel, provider: TProvider, tools?: string[]): Responder {
  return {
    type,
    model,
    provider,
    tools,
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
