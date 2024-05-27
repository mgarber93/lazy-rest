import {promptAgent} from '../agents/agent'
import {AuthoredContent} from '../../models/content'
import {parseCalls} from '../utils/utils'
import {createArgs} from './create-args'
import {presentCallingPlan} from '../utils/respond-to'

export type TAgent = "planner" | "selector" | "executor" | "parser"

export async function createCallingPlan(userContent: AuthoredContent, chatId: string) {
  const args = await createArgs()
  const selectionAgent = await promptAgent('selector', userContent, args)
  const selectedPlan = selectionAgent.content.at(-1)
  const calls = parseCalls(selectedPlan.message)
  await presentCallingPlan(chatId, calls)
}

