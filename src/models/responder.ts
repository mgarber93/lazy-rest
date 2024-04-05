export type TResponder = "chat" | "agent" | "organization";
export type TProvider = "openai" | "anthropic";

export interface Responder {
  type: TResponder;
}

export interface Model extends Responder {
  provider: TProvider;
  model: string;
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
  const castedResponder = responder as Model;
  const hasProvider = !!castedResponder?.provider;
  const hasModel = !!castedResponder?.model;
  return hasProvider && hasModel;
}