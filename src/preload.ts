// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import "reflect-metadata"
import {contextBridge} from 'electron'
import {container} from 'tsyringe'
import {Preloader} from './preloader/preloader'
import {INVOKE_CHANNELS, TInvokeChannel} from './preloader/preloaded-api'

container.register<TInvokeChannel[]>('InvokeChannels', {useValue: INVOKE_CHANNELS})

const preloadedApi = container.resolve<Preloader>(Preloader)

contextBridge.exposeInMainWorld('main', preloadedApi.preload())

export {PreloadedApi} from './preloader/preloaded-api'
