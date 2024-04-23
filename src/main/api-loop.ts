import {Conversation} from '../models/conversation';
import {oasToDescriptions, treeShake} from './oas-filter';
import {parseCalls} from './utils';
import {get} from './api/spotify';
import OpenAI from 'openai';
import {ChatCompletionMessageParam} from 'openai/resources';
import windowSender from './window-sender';
import {startAgentConversation} from './agent';
import {chat} from './api/api';
import {agentWithHttp} from './api/openai';
import {getModel} from '../models/responder';
import ChatCompletionMessage = OpenAI.ChatCompletionMessage;
import {OpenApiSpec} from '../models/open-api-spec';
import {v4} from 'uuid';
import tree from '../renderer/components/tree';

async function loadOas(): Promise<OpenApiSpec[]> {
  const id = v4();
  // how does the main process invoke the renderer?
  const response = await windowSender.asyncSend("load-oas", id);
  return response;
}


export type TAgent = "planner" | "selector" | "executor";

/**
 * Flagship organization for product
 * @param user
 */
export async function restApiOrganization(user: Conversation): Promise<{ content: string, role: string }> {
  const planner = startAgentConversation(user, "planner");
  const plan = await chat(planner.responder, planner.content);
  console.log(`p1:`, plan.content);
  const oasSpec = await loadOas();
  const filtered = oasSpec.reduce((acc: string, spec) => acc + oasToDescriptions(spec), '');

  const selector = startAgentConversation(user, 'selector', JSON.stringify(filtered, null, 2), plan.content);
  const selectedPlan = await chat(selector.responder, selector.content);
  console.log(`a1:`, selectedPlan.content);

  const calls = parseCalls(selectedPlan.content)
  let toolPlan: ChatCompletionMessage;

  for (const plannedCall of calls) {
    const specForPlannedCall = oasSpec.reduce((acc: Record<string, any>, spec: OpenApiSpec) => {
      const treeShook = treeShake(spec, calls)
      for (const key in acc) {
        acc[key] = treeShook[key]
      }
      return acc;
    }, {} as Record<string, any>);
    const executor = startAgentConversation(user, 'executor', JSON.stringify(specForPlannedCall, null, 2));
    // @todo parsing plan
    const messages: ChatCompletionMessageParam[] = executor.content
      .map(item => ({role: item.role, content: item.message, tool_call_id: item.id}))
    do {
      const model = getModel(executor.responder);
      toolPlan = await agentWithHttp(model, messages);
      messages.push(toolPlan);
      for (const toolCall of toolPlan?.tool_calls ?? []) {
        const {function: functionCall, id} = toolCall;
        const functionCallArgs = JSON.parse(functionCall.arguments);
        const results = await get(functionCallArgs.endpoint);
        windowSender.send("tool-request", toolPlan)
        messages.push({
          tool_call_id: id,
          role: "tool",
          content: JSON.stringify(results),
        }); // extend conversation with function response
      }
    } while (toolPlan.tool_calls)
  }
  return toolPlan;
}

