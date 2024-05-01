import {AuthoredContent, createContent} from '../../models/content'
import {isModel, isOrganization, Responder, TProvider, Model} from '../../models/responder'
import {getModels as listOpenAiModels, prompt, streamedPrompt} from '../providers/openai'
import {createCallingPlan} from '../organizations/swagger-gpt'
import {Conversation} from '../../models/conversation'
import {respondTo} from '../utils/respond-to'

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

export async function streamedChat(responder: Responder, conversation: Conversation) {
  if (isModel(responder)) {
    const response = await respondTo(conversation.id, (conversation.responder as Model).model)
    switch (responder.provider) {
      case "openai": {
        return streamedPrompt(responder.model, conversation.content, conversation.id, response.id)
      }
      case "anthropic": {
        throw new Error('not implemented')
      }
    }
  } else if (isOrganization(responder)) {
    const content = conversation.content
    // assume we're rest GPT for now
    if (content.length < 1)
      throw new Error('No user prompt for org to handle')

    const lastMessage = content[content.length - 1]
    return createCallingPlan(lastMessage, conversation.id)
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

