import { container } from "tsyringe"
import { Conversation, createConversation } from "../../models/conversation"
import { createContent } from "../../models/content"
import { Responder } from "../../models/responder"
import { OpenAiProvider } from "../providers/openai"
import { ApiCallPlan } from "../../models/api-call-plan"

/**
 * An Agent initial conversation has two contents:
 * 1) a system prompt describing its role
 * 2) a user prompt to respond to using the guidelines
 *
 * @param agent - type of agent
 * @param userContent - Content to respond to
 * @param args
 */
export class AgentFactory {
  protected openAiLlm = container.resolve(OpenAiProvider)
  
  public async createAgent(
    goal: string,
    instructions: string,
    responder: Responder
  ): Promise<Conversation> {
    const agentInternalConversation = createConversation()
    agentInternalConversation.responder = responder
    const instructionContent = createContent(
      instructions,
      agentInternalConversation.id,
      "system",
      "system"
    )
    agentInternalConversation.content.push(instructionContent)
    agentInternalConversation.content.push(
      createContent(goal, agentInternalConversation.id, "user", "user")
    )
    return agentInternalConversation
  }

  async promptAgent(conversation: Conversation) {
    const { responder, content } = conversation
    if (!responder) {
      throw new Error("unable to respond without conversation")
    }
    const { model } = responder
    const { content: response, role } = await this.openAiLlm.prompt(
      model,
      content
    )
    const authoredResponse = createContent(
      response,
      content[0].chatId,
      model,
      role
    )
    return authoredResponse
  }
  
  public async createAndPrompt(plan: ApiCallPlan, agent: Conversation) {
    const result = await this.promptAgent(agent)
    console.log(`${this.constructor.name}:\n${result.message}\n`)
    return {
      result,
      agent,
    }
  }
}
