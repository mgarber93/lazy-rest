import {Handler} from './handler'
import {AuthoredContent} from '../../models/content'
import {HttpRequestPlan} from '../../models/http-request-plan'
import {OpenApiSpec} from '../../models/open-api-spec'
import {oasToDescriptions, treeShake} from '../utils/oas-filter'
import {ChatCompletionMessageParam} from 'openai/resources'
import {getRespondingModel} from '../../models/responder'
import {OpenAiLlm} from '../providers/openai'
import {container, injectable, singleton} from 'tsyringe'
import {AgentConstructionArgs} from '../agents/agent'
import {MainWindowCallbackConsumer} from '../main-window-callback-consumer'

@singleton()
export class SwaggerGptController {
  private mainWindowCallbackConsumer = container.resolve(MainWindowCallbackConsumer)
  /**
   * Create arguments for agents of the organization once to dedup calls to load oas and other resources
   * needed for the template creation for the agent
   *
   * note that secrets are requested by the tool and not the agent
   */
  specToOas(spec: OpenApiSpec): string {
    return JSON.stringify(oasToDescriptions(spec), null, 2)
  }

  async createArgs() {
    const oasSpec = await this.mainWindowCallbackConsumer.loadAllOas()
    const endpoints = oasSpec.reduce((acc: string, spec: OpenApiSpec) => acc + this.specToOas(spec), '')
    return {
      endpoints,
      oasSpec,
    } as AgentConstructionArgs
  }
}

@injectable()
export class CallDetailer implements Handler<'detailCallInPlan'> {
  private openAiLlm: OpenAiLlm = container.resolve(OpenAiLlm)
  private swaggerGptController = container.resolve(SwaggerGptController)
  
  async handle(userContent: AuthoredContent, endpointCallPlan: HttpRequestPlan) {
    const {oasSpec} = await this.swaggerGptController.createArgs()
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
    
    const executorAgent = await this.agentFactory.createAgent("executor", userContent, {
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
