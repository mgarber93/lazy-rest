import { inject, injectable } from "tsyringe"
import { ipcRenderer } from "electron"
import {
  PreloadedApi,
  WindowReceiverProtocol,
  WindowSenderProtocol
} from "./preloaded-api"
import {
  channelAllowList,
  TWindowSenderChannel,
  WindowCallbackApi
} from "../window-callback/window-callback-api"

@injectable()
export class Preloader implements WindowSenderProtocol, WindowReceiverProtocol {
  constructor(
    @inject("InvokeChannels") private invokeChannels: (keyof PreloadedApi)[]
  ) {
    this.receive = this.receive.bind(this)
    this.remove = this.remove.bind(this)
    this.send = this.send.bind(this)
    this.preload = this.preload.bind(this)
    this.callback = this.callback.bind(this)
  }

  hasPreloaded = false

  preload(): WindowSenderProtocol {
    const preloadedApi = this as unknown as PreloadedApi
    for (const invokeChannel of this.invokeChannels) {
      preloadedApi[invokeChannel] = ipcRenderer.invoke.bind(
        ipcRenderer,
        invokeChannel
      )
    }
    this.hasPreloaded = true
    return preloadedApi as PreloadedApi
  }

  callback<T extends keyof WindowCallbackApi>(
    promiseId: string,
    arg: ReturnType<WindowCallbackApi[T]>
  ) {
    ipcRenderer.invoke("callback", arg)
  }

  receive<T extends keyof WindowCallbackApi>(
    channel: T,
    func: (
      event: never,
      id: string,
      ...args: Parameters<WindowCallbackApi[T]>
    ) => ReturnType<WindowCallbackApi[T]>,
  ): void {
    if (!channelAllowList.includes(channel)) {
      console.error(channel)
      return
    }
    ipcRenderer.addListener(channel, func)
  }
  
  remove(
    channel: keyof WindowCallbackApi,
    func: (...args: never[]) => void
  ): Promise<void> {
    if (!channelAllowList.includes(channel)) {
      console.error(channel)
    } else {
      ipcRenderer.removeAllListeners(channel)
    }
    return Promise.resolve()
  }
  
  send(channel: TWindowSenderChannel, data: any) {
    if (channelAllowList.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  }
}
