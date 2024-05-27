import {AuthoredContent} from '../../models/content'
import {parseCalls} from '../utils/utils'
import {container, singleton} from 'tsyringe'
import {AgentFactory} from '../agents/agent'
import {MainWindowCallbackConsumer} from '../main-window-callback-consumer'
import {SwaggerGptController} from '../handlers/call-detailer'

export type TAgent = "planner" | "selector" | "executor" | "parser"

@singleton()
export class CallingPlanner {
  private agentFactory = container.resolve(AgentFactory)
  private mainWindowCallbackConsumer = new MainWindowCallbackConsumer()
  private swaggerGptController = container.resolve(SwaggerGptController)
  
  async createCallingPlan(userContent: AuthoredContent, chatId: string) {
    const args = await this.swaggerGptController.createArgs()
    const agent = await this.agentFactory.createAgent('selector', userContent)
    const selectionAgent = await this.agentFactory.promptAgent('selector', agent.content, args)
    const calls = parseCalls(selectionAgent.message)
    await this.mainWindowCallbackConsumer.presentCallingPlan(chatId, calls)
  }
}

