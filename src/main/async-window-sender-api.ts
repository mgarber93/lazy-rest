import { container, injectable } from "tsyringe"
import { WindowSender } from "./utils/window-sender"
import { AuthoredContent, ContentDelta } from "../models/content"
import { OpenAPI } from "openapi-types"
import { WindowCallbackApi } from "../window-callback/window-callback-api"
import { Conversation, ConversationId, PlanId } from "../models/conversation"
import { ToolState } from "../renderer/features/tools"
import { ProviderConfiguration } from "../models/api-configuration"
import { ApiCallPlan } from "../models/api-call-plan"

export type Promisify<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer Result
    ? (...args: Args) => Promise<Result>
    : never
}

@injectable()
export class AsyncWindowSenderApi implements Promisify<WindowCallbackApi> {
  private windowSender = container.resolve(WindowSender)

  async callback(id: string, arg: never): Promise<void> {
    this.windowSender.callback(id, arg)
  }

  async appendContentDelta({
                             chatId,
                             messageId,
                             delta
                           }: ContentDelta): Promise<void> {
    process.stdout.write(delta)
    await this.windowSender.asyncSend("appendContentDelta", {
      delta,
      chatId,
      messageId
    })
  }

  loadAllOas(): Promise<OpenAPI.Document[]> {
    return this.windowSender.asyncSend("loadAllOas")
  }

  async appendContent(content: AuthoredContent): Promise<void> {
    await this.windowSender.asyncSend("appendContent", content)
  }

  async getOas(oasId: string) {
    const oas = await this.windowSender.asyncSend("getOas", { oasId })
    return oas as OpenAPI.Document | null
  }

  async getConversation(id: ConversationId) {
    const conversation = await this.windowSender.asyncSend("getConversation", {
      id
    })
    if (conversation === null) {
      throw new Error("Conversation not found")
    }
    return conversation as Conversation
  }

  async getPlan(planId: PlanId) {
    const plan = await this.windowSender.asyncSend("getPlan", { planId })
    if (!plan) {
      throw new Error("Plan is not defined in conversation")
    }
    return plan as ApiCallPlan
  }
  
  async updateToolState(toolState: ToolState): Promise<void> {
    await this.windowSender.asyncSend("updateToolState", { toolState })
  }
  
  async getProviderConfig() {
    return (await this.windowSender.asyncSend(
      "getProviderConfig"
    )) as ProviderConfiguration
  }
}
