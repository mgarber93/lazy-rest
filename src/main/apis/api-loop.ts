import {chat} from './openai';
import {loadOasSpec} from './oas-loader';
import {Conversation, createConversation} from '../../models/conversation';
import {apiPlanner} from '../../prompts/api-planner';
import {apiSelector} from '../../prompts/api-selector';
import {createContent} from '../../models/content';
import {OpenApiSpec} from '../../models/open-api-spec';
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

function setEndpointDescription(object: Record<string, any>, path: string, key: string, value: any) {
  if (!(path in object)) {
    object[path] = {};
  }
  object[path][key] = value;
}

function oasToDescriptions(oasSpec: OpenApiSpec): object {
  const spec = {
  };
  for (const key in oasSpec.paths){
    const endpoint = oasSpec.paths[key];

    if (endpoint.get?.description) {
      setEndpointDescription(spec, key, 'get', endpoint.get.description);
    }
    if (endpoint.put?.description) {
      setEndpointDescription(spec, key, 'put', endpoint.put.description);
    }
    if (endpoint.post?.description) {
      setEndpointDescription(spec, key, 'post', endpoint.post.description);
    }
    if (endpoint.delete?.description) {
      setEndpointDescription(spec, key, 'delete', endpoint.delete.description);
    }
  }
  return spec;
}

export async function apiAgentLoop(user: Conversation): Promise<{content: string, role: string}> {
  const planner = startAgentConversation("planner");
  planner.content.push(user.content[user.content.length - 1]);
  const plan = await chat(planner.responder, planner.content);

  const oasSpec = await loadOasSpec('spotify');
  const filtered = oasToDescriptions(oasSpec)

  const selector = startAgentConversation('selector', JSON.stringify(filtered, null, 2));
  selector.content.push(user.content[user.content.length - 1]);
  const selectedPlan = await chat(selector.responder, selector.content);
  return selectedPlan;
}

