import {Conversation, createConversation} from '../../models/conversation'
import {selector} from '../../prompts/rest-gpt/selector'
import {buildCallerPrompt} from '../../prompts/api-caller'
import {AuthoredContent, createContent} from '../../models/content'
import {TAgent} from '../organizations/swagger-gpt'
import {plannerTemplate} from '../../prompts/rest-gpt/planner'
import {OpenApiSpec} from '../../models/open-api-spec'
import {dynamicallyPickResponder} from './map-agent-to-model'
import {chat} from '../tools/api'

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
export async function createAgent(agent: TAgent, userContent: AuthoredContent, args?: AgentConstructionArgs): Promise<Conversation> {
  const agentInternalConversation = createConversation(agent)
  const {endpoints} = args ?? {}
  const model = dynamicallyPickResponder(agent)
  agentInternalConversation.responder = model
  let systemInstructions
  switch (agent) {
    case "planner": {
      systemInstructions = plannerTemplate
      break
    }
    case "selector": {
      if (!endpoints) {
        throw new Error('missing endpoints')
      }
      systemInstructions = selector(endpoints)
      break
    }
    case "executor": {
      systemInstructions = buildCallerPrompt(userContent.message, endpoints)
      break
    }
  }
  const plan = createContent(systemInstructions, agentInternalConversation.id, 'system', 'system')
  agentInternalConversation.content.push(plan)
  agentInternalConversation.content.push(userContent)
  return agentInternalConversation
}

export async function promptAgent(agentType: TAgent, content: AuthoredContent, args?: AgentConstructionArgs) {
  const agent = await createAgent(agentType, content, args)
  const response = await chat(agent.responder, agent.content)
  agent.content.push(response)
  return agent
}