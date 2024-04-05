import {Conversation, createConversation} from '../models/conversation';
import {apiPlanner} from '../prompts/api-planner';
import {apiSelector} from '../prompts/api-selector';
import {buildCallerPrompt} from '../prompts/api-caller';
import {copy, createContent} from '../models/content';
import {TAgent} from './api-loop';

export function startAgentConversation(user: Conversation, agent: TAgent, endpoints?: string, roughPlan?: string) {
  const conversation = createConversation() as Conversation;
  const userContent = user.content[user.content.length - 1]; // assume user request is the last message
  let plannerMessage;
  switch (agent) {
    case "planner": {
      plannerMessage = apiPlanner('spotify');
      break;
    }
    case "selector": {
      if (!endpoints)
        throw new Error('no endpoints')
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
  const plan = createContent(plannerMessage, conversation.id, 'system', 'system')
  conversation.content.push(plan);
  conversation.content.push(copy(userContent));
  return conversation;
}