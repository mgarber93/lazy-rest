import {container, injectable} from 'tsyringe'
import {Handler} from '../handlers/handler'
import {Conversation} from '../../models/conversation'
import {OpenAiLlm} from '../providers/openai'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {ResultInterpreterFactory} from '../agents/result-interpreter-factory'
import {Model} from '../../models/responder'

@injectable()
export class ResultInterpreter {
  private openAiLlm = container.resolve(OpenAiLlm)
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  private agentFactory = container.resolve(ResultInterpreterFactory)
  
  async handle(conversation: Conversation): Promise<void> {
    const plan = conversation.plan
    if (!plan) {
      throw new Error('Plan is not defined in conversation')
    }
    const currentStep = plan.steps.at(plan.step)
    if (!currentStep) {
      throw new Error('No current step')
    }
    const {result} = currentStep
    if (!result) {
      throw new Error('No result to interpret')
    }
    const model = (conversation.responder as Model).model
    const newResponse = await this.mainWindowCallbackConsumer.respondTo(conversation.id, model)
    const goal = conversation.content.at(-1)
    const interpretation = await this.agentFactory.create(plan)
    

    await this.mainWindowCallbackConsumer.appendContentDelta({
      chatId: conversation.id,
      messageId: newResponse.id,
      delta: interpretation.content.at(-1).message,
    })
  }
}
