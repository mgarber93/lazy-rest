import OpenAI from 'openai'
import {ChatCompletionMessageParam} from 'openai/resources'
import ChatCompletionMessage = OpenAI.ChatCompletionMessage

import {treeShake} from '../utils/oas-filter'
import {createAgent, promptAgent} from '../agents/agent'
import {getRespondingModel} from '../../models/responder'
import {OpenApiSpec} from '../../models/open-api-spec'
import {AuthoredContent} from '../../models/content'
import {parseCalls} from '../utils/utils'
import {createArgs} from './create-args'
import {agentWithHttp} from '../providers/openai'
import {approveCallingPlan, get} from '../tools/http'
import {CallingPlan} from '../../models/approvable'
import {presentCallingPlan} from '../utils/respond-to'

export type TAgent = "planner" | "selector" | "executor"

async function executeAndParse(plan: ChatCompletionMessage, approvedPlan: CallingPlan) {
  const messages = []
  const token = await approveCallingPlan(approvedPlan)
  for (const toolCall of plan?.tool_calls ?? []) {
    const {function: functionCall, id} = toolCall
    const functionCallArgs = JSON.parse(functionCall.arguments)
    const results = await get(token, functionCallArgs.endpoint)

    // extend conversation with function response for it to interpret while we have tool calls to interpret
    messages.push({
      tool_call_id: id,
      role: "tool",
      content: JSON.stringify(results),
    })
  }
  return messages
}

export async function createCallingPlan(userContent: AuthoredContent, chatId: string){
  const args = await createArgs()
  const selectionAgent = await promptAgent('selector', userContent, args)
  const selectedPlan = selectionAgent.content[selectionAgent.content.length - 1]
  const calls = parseCalls(selectedPlan.message)
  presentCallingPlan(chatId, calls)
}

/**
 * An executor is the loop between the caller and parser.
 * A caller receives the api calling plan and fills in the details using the specification
 * A parser receives the actual results and interprets it back to the caller of the executor
 */
async function executeCalls(userContent: AuthoredContent, callingPlan: CallingPlan, oasSpec: OpenApiSpec[]): Promise<void> {
  const endpoints = callingPlan.calls
  const specForPlannedCall = oasSpec.reduce((acc: Record<string, any>, spec: OpenApiSpec) => {
    const treeShook = treeShake(spec, endpoints)
    for (const key in acc) {
      acc[key] = treeShook[key]
    }
    return acc
  }, {} as Record<string, any>)

  const executorAgent = await createAgent("executor", userContent, {
    endpoints: JSON.stringify(specForPlannedCall),
    oasSpec
  })

  const messages: ChatCompletionMessageParam[] = executorAgent.content
    .map(item => ({role: item.role, content: item.message, tool_call_id: item.id}))

  const model = getRespondingModel(executorAgent.responder)
  // responder can change depending on conversation history
  // create another tool plan and for each call in the plan make the call
  const toolPlan = await agentWithHttp(model, messages)
  messages.push(toolPlan)
  await executeAndParse(toolPlan, callingPlan)
}