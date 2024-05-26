import {ipcMain, IpcMainInvokeEvent} from 'electron'

import {container} from 'tsyringe'
import {INVOKE_CHANNELS, PreloadedApi} from '../preloader/preloaded-api'


// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  INVOKE_CHANNELS.forEach((invokeChannel) => {
    const handler = container.resolve<PreloadedApi[keyof PreloadedApi]>(invokeChannel)
    ipcMain.handle(invokeChannel, (event: IpcMainInvokeEvent, ...rest: any[]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return handler(...rest)
    })
  })
}
