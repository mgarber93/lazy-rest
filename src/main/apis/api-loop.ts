import {chat} from './openai';
import {loadOasSpec} from './oas-loader';
import {Conversation, createConversation} from '../../models/conversation';
import {apiPlanner} from '../../prompts/api-planner';
import {apiSelector} from '../../prompts/api-selector';
import {createContent} from '../../models/content';
export type TAgent = "planner" | "selector";


function startAgentConversation(agent: TAgent, endpoints?: string) {
  const conversation = createConversation() as Conversation;
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
    }
  }
  const plan = createContent(plannerMessage, conversation.id, 'system', 'system')
  conversation.content.push(plan);
  conversation.responder = 'gpt-4-turbo-preview'
  return conversation;
}

export async function apiAgentLoop(user: Conversation): Promise<string> {
  const planner = startAgentConversation("planner");
  planner.content.push(user.content[user.content.length - 1]);
  const plan = chat(planner.responder, planner.content);

  const oasSpec = await loadOasSpec('spotify');
  const selector = startAgentConversation('selector', oasSpec);
  return '';
}

