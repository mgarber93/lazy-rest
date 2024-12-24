import {OpenAPI} from 'openapi-types'
import {oasToDescriptions} from '../main/utils/oas-filter'
import {mockSequence} from '../models/api-call-plan'
import * as fs from 'node:fs'


export const buildCallerPrompt = (goal: string, oasSpec: OpenAPI.Document[]) => {
  if (!goal) {
    throw new Error('Api Caller prompt missing goal for Call!')
  }
  if (!oasSpec) {
    throw new Error('Api Caller prompt missing apiDocs for Call!')
  }
  
  const serializedApiDocs = oasSpec.reduce((acc: string, spec: OpenAPI.Document) => acc + JSON.stringify(oasToDescriptions(spec), null, 2), '')
  
  const prompt = `You're planning a series of rest calls to an api. Here is documentation on the API:
${serializedApiDocs}

Respond with an array of the following json format. Note that the result is always a top level array! For example:
${JSON.stringify(mockSequence.slice(0,4).map(s => s.step), null, 2)}

Create a plan to achieve:
${goal}
`
  fs.writeFileSync('prompt.txt', prompt)
  return prompt
}

export const buildContinuePrompt = (goal: string, response: object, interpretation: string, newGoal: string) => {
  return `Refine the answer ${interpretation} to the question: ${goal}. Using only the information from the server response:
  \`\`\`json
  ${JSON.stringify(response, null, 2).slice(0, 1000)}.
  \`\`\`
  We want to know ${newGoal}`
}


