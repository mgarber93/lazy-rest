import {createConversation} from '../../models/conversation'
import {selector} from '../../prompts/rest-gpt/selector'
import {buildCallerPrompt} from '../../prompts/api-caller'
import {AuthoredContent, createContent} from '../../models/content'
import {plannerTemplate} from '../../prompts/rest-gpt/planner'
import {OpenApiSpec} from '../../models/open-api-spec'
import {container, singleton} from 'tsyringe'
import {Model} from '../../models/responder'
import {OpenAiLlm} from '../providers/openai'

export interface AgentConstructionArgs {
  endpoints?: string;
  roughPlan?: string; // used for selector to create calling plan from
  oasSpec: OpenApiSpec[];
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
  private openAiLlm = container.resolve(OpenAiLlm)
  abstract model: Model
  
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
}

@singleton()
export class PlannerFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-3.5-turbo",
  } as Model
  
  create(goal: AuthoredContent) {
    return this.createAgent(goal, plannerTemplate)
  }
}

@singleton()
export class SelectorFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-4-turbo-preview",
  } as Model
  
  create(goal: AuthoredContent, endpoints: string) {
    return this.createAgent(goal, selector(endpoints))
  }
}

@singleton()
export class ExecutorFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-4-turbo-preview",
  } as Model
  
  create(userContent: AuthoredContent, endpoints: string) {
    return buildCallerPrompt(userContent.message, endpoints)
  }
}

