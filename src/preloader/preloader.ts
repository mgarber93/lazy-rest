import {container, injectable} from 'tsyringe'
import {channelAllowList, TWindowSenderChannel} from '../models/window-sender'
import {ipcRenderer} from 'electron'
import {PreloadedApi} from './preloaded-api'

@injectable()
export class Preloader {
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
  
  preload = (invokeChannels: (keyof PreloadedApi)[]): PreloadedApi => {
    const preloadedApi = this as unknown as PreloadedApi
    for (const invokeChannel of invokeChannels) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      preloadedApi[invokeChannel] = ipcRenderer.invoke.bind(ipcRenderer, invokeChannel)
    }
    this.hasPreloaded = true
    return preloadedApi
  }
}


container.register<Preloader>(Preloader, {useClass: Preloader})