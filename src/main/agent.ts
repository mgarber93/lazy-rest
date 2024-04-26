import {Conversation, createConversation} from '../models/conversation';
import {selector} from '../prompts/rest-gpt/selector';
import {buildCallerPrompt} from '../prompts/api-caller';
import {AuthoredContent, createContent} from '../models/content';
import {TAgent} from './organization';
import {Model, Responder, TProvider} from '../models/responder';
import {plannerTemplate} from '../prompts/rest-gpt/planner';
import {OpenApiSpec} from '../models/open-api-spec';

export interface AgentConstructionArgs {
  endpoints?: string;
  roughPlan?: string; // used for selector to create calling plan from
  responder: Responder;
  oasSpec: OpenApiSpec[];
}
function dynamicallyPickResponder(agent: TAgent): Model {
  let defaultResponder = {
    type: 'chat',
    provider: "openai" as TProvider,
    model: "gpt-3.5-turbo"
  } as Model;
  switch (agent) {
    case "planner": {
      return defaultResponder;
    }
    case "selector": {
      return {
        type: 'chat',
        provider: "openai" as TProvider,
        model: "gpt-4-turbo-preview"
      };
    }
    default: {
      return defaultResponder;
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
export async function createAgent(agent: TAgent, userContent: AuthoredContent, args?: AgentConstructionArgs): Promise<Conversation> {
  const agentInternalConversation = createConversation(agent);
  const {roughPlan, responder, endpoints} = args ?? {};
  const model = dynamicallyPickResponder(agent)

  if (!responder) {
    throw new Error('unknown responder' + responder);
  }
  agentInternalConversation.responder = model;
  let systemInstructions;
  switch (agent) {
    case "planner": {
      systemInstructions = plannerTemplate;
      break;
    }
    case "selector": {
      if (!endpoints) {
        throw new Error('missing endpoints');
      }
      systemInstructions = selector(endpoints);
      break;
    }
    case "executor": {
      systemInstructions = buildCallerPrompt(userContent.message, endpoints);
      break;
    }
  }
  const plan = createContent(systemInstructions, agentInternalConversation.id, 'system', 'system')
  agentInternalConversation.content.push(plan);
  agentInternalConversation.content.push(userContent);
  return agentInternalConversation;
}