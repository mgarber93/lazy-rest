// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import "reflect-metadata"
import {contextBridge} from 'electron'
import {container} from 'tsyringe'
import {INVOKE_CHANNELS} from './preloader/preloaded-api'
import {Preloader} from './preloader/preloader'


const preloadedApi = container.resolve<Preloader>(Preloader)

contextBridge.exposeInMainWorld('main', preloadedApi.preload(INVOKE_CHANNELS))


export {PreloadedApi} from './preloader/preloaded-api'
