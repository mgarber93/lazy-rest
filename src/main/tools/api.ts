import {AuthoredContent, createContent} from '../../models/content'
import {isModel, Responder} from '../../models/responder'
import {prompt} from '../providers/openai'

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


