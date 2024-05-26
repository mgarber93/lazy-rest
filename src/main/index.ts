import {ipcMain, IpcMainInvokeEvent} from 'electron'

import {container} from 'tsyringe'
import {TInvokeChannel} from '../preloader/preloaded-api'
import {Handler} from './handlers/handler'

export function setupInvokeHandlers() {
  const channels = container.resolve<TInvokeChannel[]>("InvokeChannels")
  channels.forEach((invokeChannel) => {
    const api = container.resolve<Handler<typeof invokeChannel>>(invokeChannel)
    const handler = (event: IpcMainInvokeEvent, arg0: never, arg1: never) => {
      return api.handle(arg0, arg1)
    }
    ipcMain.handle(invokeChannel, handler)
  })
}
