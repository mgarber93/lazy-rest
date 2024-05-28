import {container, injectable} from 'tsyringe'
import {Handler} from './handler'
import {Conversation} from '../../models/conversation'
import {OpenAiLlm} from '../providers/openai'
import {MainWindowCallbackConsumer} from '../main-window-callback-consumer'
import {ResultInterpreterFactory} from '../agents/result-interpreter-factory'
import {Model} from '../../models/responder'

@injectable()
export class ResultInterpreter implements Handler<'interpretResult'> {
  private openAiLlm = container.resolve(OpenAiLlm)
  private mainWindowCallbackConsumer = container.resolve(MainWindowCallbackConsumer)
  private agentFactory = container.resolve(ResultInterpreterFactory)
  
  async handle(conversation: Conversation): Promise<void> {
    const plan = conversation.planController
    if (!plan) {
      throw new Error('Plan is not defined in conversation')
    }
    
    const {result} = plan
    const model = (conversation.responder as Model).model
    const newResponse = await this.mainWindowCallbackConsumer.respondTo(conversation.id, model)
    const goal = conversation.content.at(-1)
    const interpretation = await this.agentFactory.create(goal, plan.step, plan.endpointCallingPlan, result)
    await this.mainWindowCallbackConsumer.appendContentDelta({
      chatId: conversation.id,
      messageId: newResponse.id,
      delta: interpretation.content.at(-1).message,
    })
  }
}
