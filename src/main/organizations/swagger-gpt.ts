import { OpenAPI } from "openapi-types"
import { container, singleton } from "tsyringe"
import { Conversation } from "../../models/conversation"
import { AuthoredContent } from "../../models/content"
import { AsyncWindowSenderApi } from "../async-window-sender-api"
import { oasToDescriptions } from "../utils/oas-filter"
import { v4 } from "uuid"
import { mockSequence, SequenceActivity } from "../../models/api-call-plan"

@singleton()
export class SwaggerGpt {
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)

  private async createPlan(userGoal: string) {
    const oasSpec = await this.mainWindowCallbackConsumer.loadAllOas()
    const endpoints = oasSpec.reduce(
      (acc: string, spec: OpenAPI.Document) => acc + this.specToOas(spec),
      "",
    )
    return mockSequence as SequenceActivity[]
  }

  specToOas(spec: OpenAPI.Document): string {
    return JSON.stringify(oasToDescriptions(spec), null, 2)
  }

  /**
   * @todo this needs to be implemented at a high level
   * when we update the plan, how do we save it to the renderer process?
   * should we even be saving state in the renderer process?
   * @param conversation
   */
  async continue({ content, id, responder }: Conversation) {
    const lastMessage = content.at(-1)
    if (!lastMessage) throw new Error("unable to continue empty conversation")

    const activities = await this.createPlan(lastMessage.message)
    const plan = {
      id: v4(),
      chatId: id,
      author: responder?.model ?? "gpt-4o",
      role: "assistant",
      message: "",
      apiCallPlan: {
        steps: activities,
      },
    } satisfies AuthoredContent

    await this.mainWindowCallbackConsumer.appendContent(plan)
    // const plan = await this.createPlan(lastMessage)
    // // we now have a high level plan to present to the user in a progress stepper (if verbose)
    // while (plan.step < plan.steps.length) {
    //   // detail the step in the plan given the api it corresponds to
    //   const endpointResult = this.endpointSelector.createAndPrompt(conversation, plan)
    //   // prompt user to execute (if verbose)
    //   // show user results & interpret (if verbose)
    // }
    // return interpretation of final result
  }
}
