import { TProvider } from "../../models/responder"
import { Handler } from "./handler"
import { container } from "tsyringe"
import { OpenAiProvider } from "../providers/openai"
import { OllamaProvider } from "../providers/ollama"

export class ModelListHandle implements Handler<"getModels"> {
  private openAiLlm: OpenAiProvider = container.resolve(OpenAiProvider)
  private ollama = container.resolve(OllamaProvider)

  async handle(provider: TProvider) {
    console.log("GetModelsHandler:handle", provider)
    switch (provider) {
      case "openai": {
        return this.openAiLlm.list()
      }
      case "ollama": {
        return this.ollama.list()
      }
      default: {
        throw new Error("not implemented")
      }
    }
  }
}
