import {container, injectable} from 'tsyringe'
import {ChatCompletionMessageParam} from 'openai/resources'
import {AuthoredContent} from '../../models/content'
import {OpenApiSpec} from '../../models/open-api-spec'
import {treeShake} from '../utils/oas-filter'
import {getRespondingModel} from '../../models/responder'
import {OpenAiLlm} from '../providers/openai'
import {HttpRequestPlan} from '../../models/conversation'
import {ExecutorFactory} from '../agents/executor-factory'

@injectable()
export class CallDetailer {
  private openAiLlm: OpenAiLlm = container.resolve(OpenAiLlm)
  private agentFactory = container.resolve(ExecutorFactory)
  
  async handle(userContent: AuthoredContent, endpointCallPlan: HttpRequestPlan, oasSpec:  OpenApiSpec[]) {
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
    const endpoints = JSON.stringify(specForPlannedCall)
    const executorAgent = await this.agentFactory.create(endpointCallPlan, endpoints)
    
    const messages: ChatCompletionMessageParam[] = executorAgent.content
      .map(item => ({role: item.role, content: item.message, tool_call_id: item.id}))
    
    const model = getRespondingModel(executorAgent.responder)
    // responder can change depending on conversation history
    // create another tool plan and for each call in the plan make the call
    const toolPlan = await this.openAiLlm.agentWithHttp(model, messages)
    for (const toolCall of toolPlan?.tool_calls ?? []) {
      const {function: functionCall, id} = toolCall
      const functionCallArgs = JSON.parse(functionCall.arguments)
      // @todo assume only one and return first function call arg to GET
      
      return {
        path: functionCallArgs.endpoint,
        method: 'GET',
        headers: {},
        body: {},
      } as HttpRequestPlan
    }
    return null
    // no function call return ...?
  }
}
