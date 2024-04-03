export type TResponder = "chat";
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
  if ((responder as Model).model) {
    return (responder as Model).model;
  } else {
    throw new Error('no model set');
  }
}