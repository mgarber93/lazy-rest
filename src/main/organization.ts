import {oasToDescriptions, treeShake} from './oas-filter'
import {AgentConstructionArgs, createAgent} from './agent'
import {streamedChat} from './api/api'
import {getModel, Responder, TResponder} from '../models/responder'
import {OpenApiSpec} from '../models/open-api-spec'
import {AuthoredContent} from '../models/content'
import {loadOas} from './load-oas'
import {WindowReference} from '../models/window-reference'
import {parseCalls} from './utils'
import OpenAI from 'openai'
import {EndpointCallPlan} from '../models/endpoint'
import {ChatCompletionMessageParam} from 'openai/resources'
import {Conversation} from '../models/conversation'
import {agentWithHttp} from './api/openai'
import {get} from './api/http'
import ChatCompletionMessage = OpenAI.ChatCompletionMessage

export type TAgent = "planner" | "selector" | "executor"

/**
 * Starts a conversation with the specified agent type and user content.
 *
 * @param {TAgent} agentType - The type of agent to prompt.
 * @param {AuthoredContent} content - The content authored by the user.
 * @param windowReference - A place in the window to stream the response to
 * @param args
 * @returns {Promise<ChatConversation>} - The internal conversation with the agent.
 */
async function promptAgent(agentType: TAgent, content: AuthoredContent, windowReference: WindowReference, args?: AgentConstructionArgs): Promise<AuthoredContent[]> {
  const agent = await createAgent(agentType, content, args)
  const response = await streamedChat(agent.responder, agent.content, windowReference)
  return response
}

function specToOas(spec: OpenApiSpec): string {
  return JSON.stringify(oasToDescriptions(spec), null, 2)
}

async function createArgs() {
  const oasSpec = await loadOas()
  const endpoints = oasSpec.reduce((acc: string, spec) => acc + specToOas(spec), '')
  return {
    endpoints,
    oasSpec,
    responder: {type: 'gpt-3.5-turbo' as TResponder}
  } as AgentConstructionArgs
}

async function executeAndParse(plan: ChatCompletionMessage) {
  const messages = []
  for (const toolCall of plan?.tool_calls ?? []) {
    const {function: functionCall, id} = toolCall
    const functionCallArgs = JSON.parse(functionCall.arguments)
    const results = await get(functionCallArgs.endpoint, plan)

    // extend conversation with function response for it to interpret while we have tool calls to interpret
    messages.push({
      tool_call_id: id,
      role: "tool",
      content: JSON.stringify(results),
    })
  }
  return messages
}

/**
 * Primitive of a conversation, ie hitting next
 * @param conversation
 */
async function respondTo(conversation: Conversation) {
  const messages: ChatCompletionMessageParam[] = conversation.content
    .map(item => ({role: item.role, content: item.message, tool_call_id: item.id}))
  let toolPlan
  do {
    const model = getModel(conversation.responder) // responder can change depending on conversation history
    // create another tool plan and for each call in the plan make the call
    toolPlan = await agentWithHttp(model, messages)
    messages.push(toolPlan)
    await executeAndParse(toolPlan)
  } while (toolPlan.tool_calls)
  return messages
}


/**
 * An executor is the loop between the caller and parser.
 * A caller receives the api calling plan and fills in the details using the specification
 * A parser receives the actual results and interprets it back to the caller of the executor
 *
 * @param userContent
 * @param calls
 * @param oasSpec
 */
async function executeCalls(userContent: AuthoredContent, calls: EndpointCallPlan[], oasSpec: OpenApiSpec[]): Promise<void> {
  const specForPlannedCall = oasSpec.reduce((acc: Record<string, any>, spec: OpenApiSpec) => {
    const treeShook = treeShake(spec, calls)
    for (const key in acc) {
      acc[key] = treeShook[key]
    }
    return acc
  }, {} as Record<string, any>)

  const executorAgent = await createAgent("executor", userContent, {
    endpoints: JSON.stringify(specForPlannedCall),
    responder: {type: 'gpt-3.5-turbo' as TResponder},
    oasSpec
  })
  const callResults = await respondTo(executorAgent)
}


/**
 * Flagship organization for product
 * Move to renderer?
 * @param responder
 * @param userContent
 * @param chatId
 * @param messageId
 */
export async function restApiOrganization(responder: Responder, userContent: AuthoredContent, chatId: string, messageId: string): Promise<AuthoredContent[]> {
  const args = await createArgs()
  const windowReference = {chatId: chatId, messageId: messageId}
  const selectionAgentConversation = await promptAgent('selector', userContent, windowReference, args)
  const selectedPlan = selectionAgentConversation[selectionAgentConversation.length - 1]
  const calls = parseCalls(selectedPlan.message)
  const authoredContent = await executeCalls(userContent, calls, args.oasSpec)
  return selectionAgentConversation
}

