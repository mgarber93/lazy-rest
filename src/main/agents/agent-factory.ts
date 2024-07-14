import {Conversation, createConversation, Plan} from '../../models/conversation'
import {AuthoredContent, createContent} from '../../models/content'
import {container, singleton} from 'tsyringe'
import {Responder} from '../../models/responder'
import {OpenAiLlm} from '../providers/openai'

// @todo refactor agent factory to accept model to create and prompt, if and when subsequent prompting is needed
// lets add methods at that point or something

@singleton()
export class ResponderHandler {
  private openAiLlm = container.resolve(OpenAiLlm)
  
  async promptAgent(conversation: Conversation) {
    const {responder, content} = conversation
    switch (responder.provider) {
      case "openai": {
        const {content: response, role} = await this.openAiLlm.prompt(responder.model, content)
        const authoredResponse = createContent(response, content[0].chatId, responder.model, role)
        return authoredResponse
      }
      case "anthropic": {
        throw new Error('not implemented')
      }
    }
  }
}

/**
 * An Agent initial conversation has two contents:
 * 1) a system prompt describing its role
 * 2) a user prompt to respond to using the guidelines
 *
 * @param agent - type of agent
 * @param userContent - Content to respond to
 * @param args
 */
export abstract class AgentFactory {
  
  public abstract create(plan: Plan): Promise<Conversation>
  
  protected async createAgent(goal: AuthoredContent, instructions: string, responder: Responder): Promise<Conversation> {
    const agentInternalConversation = createConversation()
    agentInternalConversation.responder = responder
    const instructionContent = createContent(instructions, agentInternalConversation.id, 'system', 'system')
    agentInternalConversation.content.push(instructionContent)
    agentInternalConversation.content.push(goal)
    return agentInternalConversation
  }
  
  async promptAgent(conversation: Conversation) {
    const {responder, content} = conversation
    
  }
  
  protected getCurrentStep(plan: Plan) {
    const {steps, step} = plan
    return steps.at(step)
  }
  
  public async createAndPrompt(conversation: Conversation, plan: Plan) {
    const agent = await this.create(plan)
    const result = await this.promptAgent(agent)
    return {
      result,
      agent,
    }
  }
}
