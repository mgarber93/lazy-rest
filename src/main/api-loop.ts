import {oasToDescriptions, treeShake} from './oas-filter';
import {parseCalls} from './utils';
import {get} from './api/spotify';
import OpenAI from 'openai';
import {ChatCompletionMessageParam} from 'openai/resources';
import windowSender from './window-sender';
import {AgentConstructionArgs, startAgentConversation} from './agent';
import {chat} from './api/api';
import {agentWithHttp} from './api/openai';
import {getModel, Responder, TResponder} from '../models/responder';
import ChatCompletionMessage = OpenAI.ChatCompletionMessage;
import {OpenApiSpec} from '../models/open-api-spec';
import {AuthoredContent} from '../models/content';
import {loadOas} from './load-oas';

export type TAgent = "planner" | "selector" | "executor";

async function promptAgent(agentType: TAgent, userContent: AuthoredContent) {
  const agent = await startAgentConversation(agentType, userContent);
  const internalConversation = await chat(agent.responder, agent.content);
  console.log(`${agentType} internal conversation:`, internalConversation.content);
  return internalConversation;
}

async function createArgs() {
  const oasSpec = await loadOas();
  const filtered = oasSpec.reduce((acc: string, spec) => acc + oasToDescriptions(spec), '');
  const endpoints = JSON.stringify(filtered, null, 2)
  return {
    endpoints,
    responder: {type: 'gpt-4-turbo-preview' as TResponder}
  } as AgentConstructionArgs;
}

/**
 * Flagship organization for product
 * Move to renderer?
 * @param user
 */
export async function restApiOrganization(responder: Responder, userContent: AuthoredContent, chatId: string, messageId: string): Promise<void> {
  const args = await createArgs();
  const planner = await promptAgent('planner', userContent);
  // const selector = await promptAgent('selector', userContent, args);
  //
  // const calls = parseCalls(selectedPlan.content)
  // let toolPlan: ChatCompletionMessage;
  //
  // for (const plannedCall of calls) {
  //   const specForPlannedCall = oasSpec.reduce((acc: Record<string, any>, spec: OpenApiSpec) => {
  //     const treeShook = treeShake(spec, calls)
  //     for (const key in acc) {
  //       acc[key] = treeShook[key]
  //     }
  //     return acc;
  //   }, {} as Record<string, any>);
  //   const executor = startAgentConversation(user, 'executor', JSON.stringify(specForPlannedCall, null, 2));
  //   // @todo parsing plan
  //   const messages: ChatCompletionMessageParam[] = executor.content
  //     .map(item => ({role: item.role, content: item.message, tool_call_id: item.id}))
  //   do {
  //     const model = getModel(executor.responder);
  //     toolPlan = await agentWithHttp(model, messages);
  //     messages.push(toolPlan);
  //     for (const toolCall of toolPlan?.tool_calls ?? []) {
  //       const {function: functionCall, id} = toolCall;
  //       const functionCallArgs = JSON.parse(functionCall.arguments);
  //       const results = await get(functionCallArgs.endpoint);
  //       windowSender.send("tool-request", toolPlan)
  //       messages.push({
  //         tool_call_id: id,
  //         role: "tool",
  //         content: JSON.stringify(results),
  //       }); // extend conversation with function response
  //     }
  //   } while (toolPlan.tool_calls)
  // }
  // return toolPlan;
}

