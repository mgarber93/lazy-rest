import {ipcMain, IpcMainInvokeEvent} from 'electron'

import {container} from 'tsyringe'
import {TInvokeChannel} from '../preloader/preloaded-api'
import {Handler} from './handlers/handler'
import {AsyncWindowSenderApi} from './async-window-sender-api'

export function setupInvokeHandlers() {
  const channels = container.resolve<TInvokeChannel[]>("InvokeChannels")
  const windowSender = container.resolve(AsyncWindowSenderApi)
  channels.forEach((invokeChannel) => {
    const api = container.resolve<Handler<typeof invokeChannel>>(invokeChannel)
    const handler = async (event: IpcMainInvokeEvent, arg0: never, arg1: never) => {
      try {
        const result = await api.handle(arg0, arg1)
        if (invokeChannel !== 'callback') {
          const formatChannelName = (channel: string): string => {
            return channel.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
          }
          await windowSender.notify(formatChannelName(invokeChannel))
        }
        return result
      } catch (e: unknown) {
        if (e instanceof Error) {
          await windowSender.notify(e.message)
        } else {
          await windowSender.notify(String(e))
        }
      }
    }
    ipcMain.handle(invokeChannel, handler)
  })
}
