import {Handler} from './handler'
import {AuthoredContent} from '../../models/content'
import {HttpRequestPlan} from '../../models/http-request-plan'
import {createArgs} from '../organizations/create-args'
import {OpenApiSpec} from '../../models/open-api-spec'
import {treeShake} from '../utils/oas-filter'
import {createAgent} from '../agents/agent'
import {ChatCompletionMessageParam} from 'openai/resources'
import {getRespondingModel} from '../../models/responder'
import {OpenAiLlm} from '../providers/openai'
import {container} from 'tsyringe'

export class CallDetailer implements Handler<'detailCallInPlan'> {
  private openAiLlm: OpenAiLlm = container.resolve(OpenAiLlm)
  
  async handle(userContent: AuthoredContent, endpointCallPlan: HttpRequestPlan) {
    const {oasSpec} = await createArgs()
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
    
    const executorAgent = await createAgent("executor", userContent, {
      endpoints: JSON.stringify(specForPlannedCall),
      oasSpec,
    })
    
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
        body: {}, // get has no body atm
        background: endpointCallPlan.background,
      } as HttpRequestPlan
    }
    return null
    // no function call return ...?
  }
}
