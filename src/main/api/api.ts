import {AuthoredContent} from '../../models/content';
import {isModel, Responder, TProvider} from '../../models/responder';
import {getModels as listOpenAiModels, prompt, streamedPrompt} from './openai';


export async function chat(responder: Responder, content: AuthoredContent[]): Promise<{
  role: "system" | "assistant" | "user",
  content: string
}> {
  if (isModel(responder)) {
    switch (responder.provider) {
      case "openai": {
        return prompt(responder.model, content);
      }
      case "anthropic": {
        throw new Error('not implemented');
      }
    }
  }
  throw new Error(`Cant respond`);
}

export async function streamedChat(responder: Responder, content: AuthoredContent[], chatId: string, messageId: string): Promise<void> {
  if (isModel(responder)) {
    switch (responder.provider) {
      case "openai": {
        return streamedPrompt(responder.model, content, chatId, messageId);
      }
      case "anthropic": {
        throw new Error('not implemented');
      }
    }
  }
  throw new Error(`Cant respond`);
}

export async function getModels(provider: TProvider): Promise<string> {
  switch (provider) {
    case "openai": {
      return listOpenAiModels();
    }
    case "anthropic": {
      throw new Error('not implemented');
    }
  }
}

