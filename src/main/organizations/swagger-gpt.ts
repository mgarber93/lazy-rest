import {AuthoredContent} from '../../models/content'
import {parseCalls} from '../utils/utils'
import {createArgs} from './create-args'
import {presentCallingPlan} from '../utils/respond-to'
import {container, singleton} from 'tsyringe'
import {AgentFactory} from '../agents/agent'

export type TAgent = "planner" | "selector" | "executor" | "parser"

@singleton()
export class CallingPlanner {
  private agentFactory = container.resolve(AgentFactory)
  async createCallingPlan(userContent: AuthoredContent, chatId: string) {
    const args = await createArgs()
    const agent = await this.agentFactory.createAgent('selector', userContent)
    const selectionAgent = await this.agentFactory.promptAgent('selector', agent.content, args)
    const calls = parseCalls(selectionAgent.message)
    await presentCallingPlan(chatId, calls)
  }
}

