import {container, singleton} from 'tsyringe'
import {AuthoredContent} from '../../models/content'
import {treeShake} from '../utils/oas-filter'
import {OpenAiProvider} from '../providers/openai'
import {OpenAPI} from 'openapi-types'
import {ApiCallPlan, HttpRequestPlan} from '../../models/api-call-plan'

@singleton()
export class CallDetailer {
  private openAiLlm: OpenAiProvider = container.resolve(OpenAiProvider)
  
  async handle(userContent: AuthoredContent, endpointCallPlan: HttpRequestPlan, oasSpec: OpenAPI.Document[], plan: ApiCallPlan) {
    const specForPlannedCall = oasSpec.reduce((acc: Record<string, any>, spec: OpenAPI.Document) => {
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

    
    // const messages: ChatCompletionMessageParam[] = executorAgent.content
    //   .map(item => ({role: item.role, content: item.message!, tool_call_id: item.id}))
    //
    // const model = getRespondingModel(executorAgent.responder as Responder)
    // // responder can change depending on conversation history
    // // create another tool plan and for each call in the plan make the call
    // const toolPlan = await this.openAiLlm.agentWithHttp(model, messages)
    // for (const toolCall of toolPlan?.tool_calls ?? []) {
    //   const {function: functionCall, id} = toolCall
    //   const functionCallArgs = JSON.parse(functionCall.arguments)
    //   // @todo assume only one and return first function call arg to GET
    //
    //   return {
    //     path: functionCallArgs.endpoint,
    //     method: 'GET',
    //     headers: {},
    //     body: {},
    //   } as HttpRequestPlan
    // }
    return null
    // no function call return ...?
  }
}
