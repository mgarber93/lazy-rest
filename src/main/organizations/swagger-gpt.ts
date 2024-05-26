import OpenAI from 'openai'
import {promptAgent} from '../agents/agent'
import {AuthoredContent} from '../../models/content'
import {parseCalls} from '../utils/utils'
import {createArgs} from './create-args'
import {approveCallingPlan, get} from '../tools/http'
import {CallingPlan} from '../../models/approvable'
import {presentCallingPlan} from '../utils/respond-to'
import ChatCompletionMessage = OpenAI.ChatCompletionMessage

export type TAgent = "planner" | "selector" | "executor" | "parser"

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

export async function createCallingPlan(userContent: AuthoredContent, chatId: string) {
  const args = await createArgs()
  const selectionAgent = await promptAgent('selector', userContent, args)
  const selectedPlan = selectionAgent.content.at(-1)
  const calls = parseCalls(selectedPlan.message)
  presentCallingPlan(chatId, calls)
}

