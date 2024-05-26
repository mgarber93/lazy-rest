import {IpcMainInvokeEvent} from 'electron'

abstract class PreloadedApi {
  abstract channel: string
  
  abstract handler(arg: any): any
}


type THandler = (event: IpcMainInvokeEvent, arg: never) => void

export class PreloadableApi {
  getChannels() {
    return ['getModels']
  }
  
  getChannelToHandler() {
    return {
      getModels: console.log.bind(console),
    } as Record<string, THandler>
  }
}