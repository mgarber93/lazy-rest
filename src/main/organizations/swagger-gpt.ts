import {AuthoredContent} from '../../models/content'
import {parseCalls} from '../utils/utils'
import {container, singleton} from 'tsyringe'
import {AgentConstructionArgs, AgentFactory} from '../agents/agent'
import {MainWindowCallbackConsumer} from '../main-window-callback-consumer'
import {OpenApiSpec} from '../../models/open-api-spec'
import {oasToDescriptions} from '../utils/oas-filter'

export type TAgent = "planner" | "selector" | "executor" | "parser"

@singleton()
export class CallingPlanner {
  private agentFactory = container.resolve(AgentFactory)
  private mainWindowCallbackConsumer = new MainWindowCallbackConsumer()
  
  async createCallingPlan(userContent: AuthoredContent, chatId: string) {
    const args = await createArgs()
    const agent = await this.agentFactory.createAgent('selector', userContent)
    const selectionAgent = await this.agentFactory.promptAgent('selector', agent.content, args)
    const calls = parseCalls(selectionAgent.message)
    await this.mainWindowCallbackConsumer.presentCallingPlan(chatId, calls)
  }
}

