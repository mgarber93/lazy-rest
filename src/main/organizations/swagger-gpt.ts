import {container, singleton} from 'tsyringe'
import {Conversation} from '../../models/conversation'
import {AuthoredContent} from '../../models/content'
import {v4} from 'uuid'
import {buildCallerPrompt} from '../../prompts/api-caller-dispatcher'
import {AsyncWindowSenderApi} from '../async-window-sender-api'
import {OpenAiProvider} from '../providers/openai'
import {ApiCallPlan, HttpRequestPlan, ProgressStage, SequenceActivity} from '../../models/api-call-plan'
import {OllamaProvider} from '../providers/ollama'


@singleton()
export class SwaggerGpt {
  private windowSender = container.resolve(AsyncWindowSenderApi)
  private openAiProvider = container.resolve(OpenAiProvider)
  private ollamaProvider = container.resolve(OllamaProvider)
  
  private async createPlan(userGoal: string) {
    const oasSpec = await this.windowSender.loadAllOas()
    const prompt = buildCallerPrompt(userGoal, oasSpec)
    const result = await this.openAiProvider.promptAndParseJson<HttpRequestPlan[]>('gpt-4o-mini', [{
      role: 'user',
      content: prompt,
    }])
    return result
  }
  
  /**
   * @todo this needs to be implemented at a high level
   * when we update the plan, how do we save it to the renderer process?
   * should we even be saving state in the renderer process?
   * @param conversation
   */
  async start({content, id, responder}: Conversation) {
    const lastMessage = content.at(-1)
    if (!lastMessage)
      throw new Error('unable to continue empty conversation')
    
    let activities = await this.createPlan(lastMessage.message)
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    activities = Array.isArray(activities.plan) ? activities.plan : activities
    
    function mapToStep(plan: HttpRequestPlan, first: boolean): SequenceActivity {
      return {
        id: v4(),
        progressStage: first ? ProgressStage.active : ProgressStage.draft,
        step: plan,
      }
    }
    
    const plan = {
      id: v4(),
      chatId: id,
      author: responder?.model ?? 'gpt-4o',
      role: 'assistant',
      message: '',
      apiCallPlan: {
        steps: Array.isArray(activities) ? activities.map((a, i) => mapToStep(a, i === 0)) : [mapToStep(activities, true)],
      } satisfies ApiCallPlan,
    } satisfies AuthoredContent
    await this.windowSender.appendContent(plan)
    // const plan = await this.createPlan(lastMessage)
    // // we now have a high level plan to present to the user in a progress stepper (if verbose)
    // while (plan.step < plan.steps.length) {
    //   // detail the step in the plan given the api it corresponds to
    //   const endpointResult = this.endpointSelector.createAndPrompt(conversation, plan)
    //   // prompt user to execute (if verbose)
    //   // show user results & interpret (if verbose)
    // }
    // return interpretation of final result
  }
  
  // async continue(conversation: Conversation) {
  //   const nextPlan =
  //   const state = {
  //     chatId: conversation.id,
  //     contentId: conversation.content.at(-1).id,
  //     nextPlan
  //   } satisfies UpdateStepActivityPayload
  //   this.windowSender.updateStep(state)
  // }
}
