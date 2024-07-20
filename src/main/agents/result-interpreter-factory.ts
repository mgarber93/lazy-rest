import {singleton} from 'tsyringe'
import {AgentFactory} from './agent-factory'
import {Responder} from '../../models/responder'
import {ApiCallPlan} from '../organizations/api-call-plan'

@singleton()
export class ResultInterpreterFactory extends AgentFactory {
  model = {
    type: 'chat',
    provider: "openai",
    model: "gpt-4o",
  } satisfies Responder
  
  create(plan: ApiCallPlan) {
    const {userGoal, steps, step} = plan
    const current = steps[step]
    if (!current.action) {
      throw new Error('Current step has no action to take defined. Interpretation called out of order')
    }
    const template = `
You are an expert parser of json. You had a plan to achieve:
${userGoal.message}
Here's your plan:
${steps.map(request => request.background).join('\n')}
You are on step ${step} of a plan:
The ${current.action.method} to ${current.action.path} in order to ${current.background} returned:
 ${JSON.stringify(current.result)}
Answer if the goal of the call was achieved and what the result was
`
    return this.createAgent(userGoal, template)
  }
}
