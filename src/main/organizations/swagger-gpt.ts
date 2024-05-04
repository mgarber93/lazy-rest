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
import {DetailedCall, EndpointCallPlan} from '../../models/endpoint'

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
  const selectedPlan = selectionAgent.content.at(-1)
  const calls = parseCalls(selectedPlan.message)
  presentCallingPlan(chatId, calls)
}

export async function detailCallInPlan(userContent: AuthoredContent, endpointCallPlan: EndpointCallPlan) {
  const {oasSpec} = await createArgs()
  const specForPlannedCall = oasSpec.reduce((acc: Record<string, any>, spec: OpenApiSpec) => {
    const treeShook = treeShake(spec, [endpointCallPlan])
    for (const key in treeShook) {
      acc[key] = treeShook[key]
    }
    return acc
  }, {} as Record<string, any>)

  if (Object.keys(specForPlannedCall).length === 0) {
    throw new Error('Unable to tree shake')
  }

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
  for (const toolCall of toolPlan?.tool_calls ?? []) {
    const {function: functionCall, id} = toolCall
    const functionCallArgs = JSON.parse(functionCall.arguments)
    // @todo assume only one and return first function call arg to GET

    return {
      path: functionCallArgs.endpoint,
      method: 'GET',
      headers: {}, // headers if any
      body: {}, // body if any
      background: ''
    } as DetailedCall
  }
  return null
  // no function call return ...?
}

// export async function runExecution(plan: DetailedCall) {
//   // await executeAndParse(plan, callingPlan)
//   return null
// }