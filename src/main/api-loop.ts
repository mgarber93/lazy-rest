import {agentWithHttp, chat} from './openai';
import {loadOasSpec} from './oas-loader';
import {Conversation, createConversation} from '../models/conversation';
import {apiPlanner} from '../prompts/api-planner';
import {apiSelector} from '../prompts/api-selector';
import {copy, createContent} from '../models/content';
import {buildCallerPrompt} from '../prompts/api-caller';
import {oasToDescriptions} from './oas-filter';


export type TAgent = "planner" | "selector" | "executor";

function startAgentConversation(user: Conversation, agent: TAgent, endpoints?: string) {
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
      plannerMessage = apiSelector('spotify', endpoints);
      break;
    }
    case "executor": {
      plannerMessage = buildCallerPrompt(userContent.message, endpoints);
      break;
    }
  }
  const plan = createContent(plannerMessage, conversation.id, 'system', 'system')
  conversation.content.push(plan);
  conversation.responder = 'gpt-4-turbo-preview'
  conversation.content.push(copy(userContent));
  return conversation;
}

export async function apiAgentLoop(user: Conversation): Promise<{ content: string, role: string }> {
  const planner = startAgentConversation(user, "planner");
  const plan = await chat(planner.responder, planner.content);
  console.log(`p1:`, plan.content);
  const oasSpec = await loadOasSpec('spotify');
  const filtered = oasToDescriptions(oasSpec)
  
  const selector = startAgentConversation(user, 'selector', JSON.stringify(filtered, null, 2));
  const selectedPlan = await chat(selector.responder, selector.content);
  console.log(`a1:`, selectedPlan.content);
  const calls = selectedPlan.content
    .split('\n')
    .filter(str => str.startsWith('API calling'))
    .map(str => str.split(":", 1)[1]);
  
  for (const plannedCall of calls) {
    const executor = startAgentConversation(user, 'executor', JSON.stringify(filtered, null, 2));
    const toolPlan = await agentWithHttp(executor.responder, executor.content);
    for (const call of toolPlan.tool_calls) {
    }
  }
  throw new Error('not implemented');
}

