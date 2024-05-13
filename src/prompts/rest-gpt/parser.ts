import {HttpRequestPlan} from '../../models/http-request-plan'


export const parserTemplate = (userQuery: string, index: number, plan: HttpRequestPlan[], response: object) => `
You are an expert parser of json, with excellent accuracy.
You had a plan to achieve user desire:
${userQuery}
Here's your plan:
${plan.map(request => request.background).join('\n')}
You are on step ${index} of a plan:
The ${plan[index].method} to ${plan[index].path} in order to ${plan[index].background} returned:
 ${JSON.stringify(response)}
Answer if the goal of the call was achieved and what the result was
`