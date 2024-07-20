import {container} from 'tsyringe'
import {Conversation, createConversation} from '../../models/conversation'
import {AuthoredContent, createContent} from '../../models/content'
import {Responder} from '../../models/responder'
import {OpenAiLlm} from '../providers/openai'
import {ApiCallPlan} from '../organizations/api-call-plan'


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
  protected abstract model: Responder
  protected openAiLlm = container.resolve(OpenAiLlm)
  public abstract create(plan: ApiCallPlan): Promise<Conversation>
  
  protected async createAgent(goal: AuthoredContent, instructions: string): Promise<Conversation> {
    const responder = this.model
    const agentInternalConversation = createConversation()
    agentInternalConversation.responder = responder
    const instructionContent = createContent(instructions, agentInternalConversation.id, 'system', 'system')
    agentInternalConversation.content.push(instructionContent)
    agentInternalConversation.content.push(goal)
    return agentInternalConversation
  }
  
  async promptAgent(conversation: Conversation) {
    const {responder, content} = conversation
    if (!responder) {
      throw new Error('unable to respond without conversation')
    }
    const {model} = responder
    const {content: response, role} = await this.openAiLlm.prompt(model, content)
    const authoredResponse = createContent(response, content[0].chatId, model, role)
    return authoredResponse
  }
  
  protected getCurrentStep(plan: ApiCallPlan) {
    const {steps, step} = plan
    return steps.at(step)
  }
  
  public async createAndPrompt(conversation: Conversation, plan: ApiCallPlan) {
    const agent = await this.create(plan)
    const result = await this.promptAgent(agent)
    console.log(`${this.constructor.name}:\n${result.message}\n`)
    return {
      result,
      agent,
    }
  }
}
