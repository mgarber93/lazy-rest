export const template = (
  userGoal: any,
  steps: any[],
  step: string,
  result: object
) => `
You are an expert parser of json. You had a plan to achieve:
${userGoal}
Here's your plan:
${steps.map((request) => request.steps).join("\n")}
You are on step ${step} of a plan which returned:
 ${JSON.stringify(result)}
Answer if the goal of the call was achieved and what the result was
`
