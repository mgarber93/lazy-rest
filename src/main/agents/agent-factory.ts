import {Conversation, createConversation, Plan} from '../../models/conversation'
import {AuthoredContent, createContent} from '../../models/content'
import {container} from 'tsyringe'
import {Model} from '../../models/responder'
import {OpenAiLlm} from '../providers/openai'


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
  private openAiLlm = container.resolve(OpenAiLlm)
  abstract model: Model
  
  public abstract create(plan: Plan): Promise<Conversation>
  
  protected async createAgent(goal: AuthoredContent, instructions: string) {
    const agentInternalConversation = createConversation()
    agentInternalConversation.responder = this.model
    const instructionContent = createContent(instructions, agentInternalConversation.id, 'system', 'system')
    agentInternalConversation.content.push(instructionContent)
    agentInternalConversation.content.push(goal)
    return agentInternalConversation
  }
  
  async promptAgent(content: AuthoredContent[]) {
    const responder = this.model
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
  
  protected getCurrentStep(plan: Plan) {
    const {steps, step} = plan
    return steps.at(step)
  }
}
