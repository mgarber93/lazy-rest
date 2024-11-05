import { container, singleton } from "tsyringe"
import { Handler } from "./handler"
import { ConfigurationManager } from "../providers/configuration-manager"
import { ClientOptions } from "openai"

@singleton()
export class OpenAiConfigHandler implements Handler<"setOpenAiConfiguration"> {
  private configManager = container.resolve(ConfigurationManager)
  
  async handle(config: ClientOptions): Promise<void> {
    this.configManager.setOpenAiConfig(config)
  }
}
