export type TResponder = "chat" | "agent" | "organization";
export type TProvider = "openai" | "anthropic";

export interface Responder {
  type: TResponder;
}

export interface Model extends Responder {
  provider: TProvider;
  model: string;
}

export interface Organization extends Model {
}

export interface Agent extends Model {
  instructions: string;
}

export function createModelResponder(type: TResponder, model: string, provider: TProvider): Model {
  return {
    type,
    model,
    provider,
  };
}

export function getModel(responder: Responder): string {
  return (responder as Model)?.model;
}

export function isModel(responder: Responder): responder is Model {
  return responder.type === 'chat';
}

export function isOrganization(responder: Responder): responder is Organization {
  return responder.type === 'organization';
}