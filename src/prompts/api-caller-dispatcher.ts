import {OpenAPI} from 'openapi-types'
import {oasToDescriptions} from '../main/utils/oas-filter'


export const buildCallerPrompt = (goal: string, oasSpec: OpenAPI.Document[]) => {
  if (!goal) {
    throw new Error('Api Caller prompt missing goal for Call!')
  }
  if (!oasSpec) {
    throw new Error('Api Caller prompt missing apiDocs for Call!')
  }
  
  const serializedApiDocs = oasSpec.reduce((acc: string, spec: OpenAPI.Document) => acc + JSON.stringify(oasToDescriptions(spec), null, 2), '')
  
  return `Respond with an array of the following json format:
  name: string,
  httpVerb: enum,
  url: string,
  headers: Record<\\string, string>,
You're planning a series of rest calls to achieve the goal:
${goal}
Here is documentation on the API:
Endpoints:
${serializedApiDocs}
`
}


