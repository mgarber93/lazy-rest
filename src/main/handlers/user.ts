import { userInfo } from "os"
import { Handler } from "./handler"
import { injectable } from "tsyringe"

@injectable()
export class OperatingSystem implements Handler<"getMachineName"> {
  async handle() {
    return userInfo()?.username
  }
}
