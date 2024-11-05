import { AuthoredContent } from "../../models/content"

export interface PromptableProvider {
  list(): Promise<string[]>
  
  streamedPrompt(
    model: string,
    content: AuthoredContent[],
    chatId: string,
    messageId: string
  ): Promise<AuthoredContent[]>
}
