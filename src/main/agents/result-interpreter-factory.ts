import {singleton} from 'tsyringe'
import {Model} from '../../models/responder'
import {HttpRequestPlan} from '../../models/http-request-plan'
import {AgentFactory} from './agent'
import {AuthoredContent} from '../../models/content'

@singleton()
export class ResultInterpreterFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-4-4o",
  } as Model
  
  create(goal: AuthoredContent, index: number, plan: HttpRequestPlan[], response: object) {
    const template = `
You are an expert parser of json, with excellent accuracy.
You had a plan to achieve user desire:
${goal.message}
Here's your plan:
${plan.map(request => request.background).join('\n')}
You are on step ${index} of a plan:
The ${plan[index].method} to ${plan[index].path} in order to ${plan[index].background} returned:
 ${JSON.stringify(response)}
Answer if the goal of the call was achieved and what the result was
`
    return this.createAgent(goal, template)
  }
}
