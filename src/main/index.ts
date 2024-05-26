import {ipcMain, IpcMainInvokeEvent} from 'electron'

import {container} from 'tsyringe'
import {PreloadedApi, TInvokeChannel} from '../preloader/preloaded-api'

export function setupInvokeHandlers() {
  const channels = container.resolve<TInvokeChannel[]>("InvokeChannels")
  channels.forEach((invokeChannel) => {
    const api = container.resolve<PreloadedApi[keyof PreloadedApi]>(invokeChannel)
    const handler = (event: IpcMainInvokeEvent, ...rest: Parameters<PreloadedApi[keyof PreloadedApi]>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return api(...rest)
    }
    ipcMain.handle(invokeChannel, handler)
  })
}
