import { OpenAPI } from "openapi-types"

export const buildCallerPrompt = (
  goal: string,
  apiDocs: OpenAPI.Document | null
) => {
  if (!goal) {
    throw new Error("Api Caller prompt missing goal for Call!")
  }
  if (!apiDocs) {
    throw new Error("Api Caller prompt missing apiDocs for Call!")
  }
  
  const serializedApiDocs = JSON.stringify(apiDocs, null, 2)
  
  return `You are an agent that gets a call in a sequence of API calls and given their documentation, should execute that call and return the final response.
If you cannot complete them and run into issues, you should explain the issue. If you're able to resolve an API call, you can retry the API call. When interacting with API objects, you should extract ids for inputs to other API calls but ids and names for outputs returned to the User.
Your task is to complete the corresponding api calls according to the plan.
Goal:
${goal}
Here is documentation on the API:
Endpoints:
${serializedApiDocs}
If the API path contains "{}", it means that it is a variable and you should replace it with the appropriate value. For example, if the path is "/users/{user_id}/tweets", you should replace "{user_id}" with the user id. "{" and "}" cannot appear in the url.
You can use http request methods, i.e., GET, POST, DELETE, PATCH, PUT, and generate the corresponding parameters according to the tools description.
`
}
