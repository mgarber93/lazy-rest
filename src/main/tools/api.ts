import {AuthoredContent, createContent} from '../../models/content'
import {isModel, isOrganization, Responder, TProvider} from '../../models/responder'
import {getModels as listOpenAiModels, prompt, streamedPrompt} from '../providers/openai'
import {restApiOrganization} from '../organizations/swagger-gpt'
import {WindowReference} from '../../models/window-reference'

export interface RoleContent {
  role: "system" | "assistant" | "user",
  content: string
}

/**
 * Prompts the responder for a response and creates authored content from the response
 * @param responder
 * @param content - Response is not appended to the content!
 */
export async function chat(responder: Responder, content: AuthoredContent[]): Promise<AuthoredContent> {
  if (isModel(responder)) {
    switch (responder.provider) {
      case "openai": {
        const {content: response, role} = await prompt(responder.model, content)
        const authoredResponse = createContent(response, content[0].chatId, responder.model, role)
        return authoredResponse
      }
      case "anthropic": {
        throw new Error('not implemented')
      }
    }
  }
  throw new Error(`Responder not implemented`)
}

/**
 * Entrypoint from renderer process
 * @param responder
 * @param content
 * @param windowReference
 */
export async function streamedChat(responder: Responder, content: AuthoredContent[], windowReference: WindowReference): Promise<AuthoredContent[]> {
  const {chatId, messageId} = windowReference
  if (isModel(responder)) {
    switch (responder.provider) {
      case "openai": {
        return streamedPrompt(responder.model, content, chatId, messageId)
      }
      case "anthropic": {
        throw new Error('not implemented')
      }
    }
  } else if (isOrganization(responder)) {
    // @todo handle organization here
    // assume we're rest GPT for now
    if (content.length < 1)
      throw new Error('No user prompt for org to handle')

    const lastMessage = content[content.length - 1]
    return restApiOrganization(lastMessage, chatId, messageId)
  }

  throw new Error(`Cant respond`)
}

export async function getAllProviderModels(provider: TProvider): Promise<string> {
  switch (provider) {
    case "openai": {
      return listOpenAiModels()
    }
    case "anthropic": {
      throw new Error('not implemented')
    }
  }
}

