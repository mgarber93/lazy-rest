import {inject, injectable} from 'tsyringe'
import {channelAllowList, TWindowSenderChannel} from '../models/window-sender'
import {ipcRenderer} from 'electron'
import {PreloadedApi} from './preloaded-api'

@injectable()
export class Preloader {
  constructor(@inject('InvokeChannels') private invokeChannels: (keyof PreloadedApi)[]) {
  }
  hasPreloaded = false
  
  send = (channel: TWindowSenderChannel, data: any) => {
    if (channelAllowList.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  }
  
  receive = (channel: TWindowSenderChannel, func: (...args: any[]) => void) => {
    if (!channelAllowList.includes(channel)) {
      console.error(channel)
      return
    }
    ipcRenderer.addListener(channel, func)
  }
  
  remove = (channel: TWindowSenderChannel, func: (...args: any[]) => void) => {
    if (!channelAllowList.includes(channel)) {
      console.error(channel)
      return
    }
    ipcRenderer.removeAllListeners(channel)
  }
  
  preload = (): PreloadedApi => {
    const preloadedApi = this as unknown as PreloadedApi
    for (const invokeChannel of this.invokeChannels) {
      preloadedApi[invokeChannel] = ipcRenderer.invoke.bind(ipcRenderer, invokeChannel)
    }
    this.hasPreloaded = true
    return preloadedApi
  }
}
