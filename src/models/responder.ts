export type TResponder = "chat" | "agent" | "organization"
export type TProvider = "openai" | "bedrock" | "ollama"


export type Responder = {
  type: TResponder;
  provider: TProvider;
  model: string;
  responding?: boolean;
  tools?: string[]; // Array of tool IDs
}



export function isModel(responder: Responder): responder is Responder {
  return responder.type === 'chat'
}

