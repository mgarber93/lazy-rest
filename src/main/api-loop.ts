import {oasToDescriptions} from './oas-filter';
import {AgentConstructionArgs, createAgent} from './agent';
import {chat, RoleContent, streamedChat} from './api/api';
import {Responder, TResponder} from '../models/responder';
import {OpenApiSpec} from '../models/open-api-spec';
import {AuthoredContent} from '../models/content';
import {loadOas} from './load-oas';
import {WindowReference} from '../models/window-reference';

export type TAgent = "planner" | "selector" | "executor";

/**
 * Starts a conversation with the specified agent type and user content.
 *
 * @param {TAgent} agentType - The type of agent to prompt.
 * @param {AuthoredContent} content - The content authored by the user.
 * @param windowReference - A place in the window to stream the response to
 * @param args
 * @returns {Promise<ChatConversation>} - The internal conversation with the agent.
 */
async function promptAgent(agentType: TAgent, content: AuthoredContent, windowReference: WindowReference, args?: AgentConstructionArgs): Promise<void> {
  const agent = await createAgent(agentType, content, args);
  agent.content.push(content);
  await streamedChat(agent.responder, agent.content, windowReference);
}

function specToOas(spec: OpenApiSpec): string {
  return JSON.stringify(oasToDescriptions(spec), null, 2);
}

async function createArgs() {
  const oasSpec = await loadOas();
  const endpoints = oasSpec.reduce((acc: string, spec) => acc + specToOas(spec), '');
  return {
    endpoints,
    responder: {type: 'gpt-3.5-turbo' as TResponder}
  } as AgentConstructionArgs;
}

/**
 * Flagship organization for product
 * Move to renderer?
 * @param user
 */
export async function restApiOrganization(responder: Responder, userContent: AuthoredContent, chatId: string, messageId: string): Promise<void> {
  const args = await createArgs();
  const windowReference = {chatId: chatId, messageId: messageId};
  const selector = await promptAgent('selector', userContent, windowReference, args);

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

