import {container, injectable} from 'tsyringe'
import {ConversationContext} from '../../models/conversation'
import {OpenAiLlm} from '../providers/openai'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {ResultInterpreterFactory} from '../agents/result-interpreter-factory'
import {Model} from '../../models/responder'


@injectable()
export class ResultInterpreter {
  private openAiLlm = container.resolve(OpenAiLlm)
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  private agentFactory = container.resolve(ResultInterpreterFactory)
  
  async handle(context: ConversationContext): Promise<void> {
    const {conversationId, planId, toolState} = context
    const conversation = await this.mainWindowCallbackConsumer.getConversation(conversationId)
    const plan = await this.mainWindowCallbackConsumer.getPlan(planId)
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
    const newResponse = await this.mainWindowCallbackConsumer.addNewResponse(conversation.id, model)
    const goal = conversation.content.at(-1)
    const interpretation = await this.agentFactory.create(plan)
    

    await this.mainWindowCallbackConsumer.appendContentDelta({
      chatId: conversation.id,
      messageId: newResponse.id,
      delta: interpretation.content.at(-1).message,
    })
  }
}
