export type TResponder = "chat" | "agent" | "organization"
export type TProvider = "openai" | "anthropic"

export type Responder = {
  type: TResponder;
  provider: TProvider;
  model: string;
  orgId?: string;
}

export function createModelResponder(type: TResponder, model: Responder['model'], provider: TProvider): Responder {
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
