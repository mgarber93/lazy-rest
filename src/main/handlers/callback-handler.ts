import { container, singleton } from "tsyringe"
import { Handler } from "./handler"
import { AsyncWindowSenderApi } from "../async-window-sender-api"

@singleton()
export class CallbackHandler implements Handler<"callback"> {
  private mainWindowCallbackConsumer = container.resolve(AsyncWindowSenderApi)
  
  async handle(id: string, arg: never) {
    return this.mainWindowCallbackConsumer.callback(id, arg)
  }
}
