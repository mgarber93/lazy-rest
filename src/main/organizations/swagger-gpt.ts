import {treeShake} from '../utils/oas-filter'
import {AgentConstructionArgs, createAgent} from '../agents/agent'
import {getModel, TResponder} from '../../models/responder'
import {OpenApiSpec} from '../../models/open-api-spec'
import {AuthoredContent} from '../../models/content'
import {parseCalls} from '../utils/utils'
import OpenAI from 'openai'
import {EndpointCallPlan} from '../../models/endpoint'
import {ChatCompletionMessageParam} from 'openai/resources'
import {Conversation} from '../../models/conversation'

import {createArgs} from './create-args'
import ChatCompletionMessage = OpenAI.ChatCompletionMessage

export type TAgent = "planner" | "selector" | "executor"


async function promptAgent(agentType: TAgent, content: AuthoredContent, args?: AgentConstructionArgs) {
  const agent = await createAgent(agentType, content, args)
  const response = await chat(agent.responder, agent.content)
  agent.content.push(response)
  return agent
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
 * @param userContent
 * @param chatId
 * @param messageId
 */
export async function restApiOrganization(userContent: AuthoredContent, chatId: string, messageId: string): Promise<AuthoredContent[]> {
  const args = await createArgs()
  const windowReference = {chatId: chatId, messageId: messageId}
  const selectionAgent = await promptAgent('selector', userContent, args)
  const selectedPlan = selectionAgent.content[selectionAgent.content.length - 1]
  const calls = parseCalls(selectedPlan.message)
  const authoredContent = await executeCalls(userContent, calls, args.oasSpec)

}

