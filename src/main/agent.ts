import {Conversation, createConversation} from '../models/conversation';
import {apiPlanner} from '../prompts/api-planner';
import {apiSelector} from '../prompts/api-selector';
import {buildCallerPrompt} from '../prompts/api-caller';
import {AuthoredContent, createContent} from '../models/content';
import {TAgent} from './api-loop';
import {Responder} from '../models/responder';

export interface AgentConstructionArgs {
  endpoints?: string;
  roughPlan?: string; // used for selector to create calling plan from
  responder: Responder;
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
export async function startAgentConversation(agent: TAgent, userContent: AuthoredContent, args?: AgentConstructionArgs): Promise<Conversation> {
  const agentInternalConversation = createConversation(agent);
  const {roughPlan, responder, endpoints} = args ?? {};
  agentInternalConversation.responder = responder;
  let plannerMessage;
  switch (agent) {
    case "planner": {
      plannerMessage = apiPlanner('spotify');
      break;
    }
    case "selector": {
      if (!roughPlan)
        throw new Error('no rough plan')

      plannerMessage = apiSelector('spotify', endpoints, roughPlan);
      break;
    }
    case "executor": {
      plannerMessage = buildCallerPrompt(userContent.message, endpoints);
      break;
    }
  }
  const plan = createContent(plannerMessage, agentInternalConversation.id, 'system', 'system')
  agentInternalConversation.content.push(plan);
  return agentInternalConversation;
}