import {EnhancedStore} from '@reduxjs/toolkit'
import {channelAllowList, TWindowSenderChannel} from './window-callback/window-callback-api'
import {ReduxStoreCallbackApi} from './renderer/redux-store-callback-api'


export const connectCallbacks = (store: EnhancedStore) => {
  const callbacks = new ReduxStoreCallbackApi(store)
  channelAllowList.forEach(channelAllowList => {
    window.main.receive<TWindowSenderChannel>(channelAllowList, (event:  Electron. IpcRendererEvent, promiseId: string, ...args: Parameters<typeof callbacks[typeof channelAllowList]>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = callbacks[channelAllowList](...args)
      window.main.callback(promiseId, result)
    })
  })
}
