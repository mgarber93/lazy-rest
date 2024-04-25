import {AuthoredContent} from '../../models/content';
import {isModel, isOrganization, Responder, TProvider} from '../../models/responder';
import {getModels as listOpenAiModels, prompt, streamedPrompt} from './openai';
import {restApiOrganization} from '../api-loop';

export interface RoleContent {
  role: "system" | "assistant" | "user",
  content: string
}


export async function chat(responder: Responder, content: AuthoredContent[]): Promise<RoleContent> {
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
  } else if (isOrganization(responder)) {
    // @todo handle organization here
    // assume we're rest GPT for now
    if (content.length < 1)
      throw new Error('No user prompt for org to handle')

    const prompt = content[content.length - 1];
    return restApiOrganization(responder, prompt, chatId, messageId);
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

