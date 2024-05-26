// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import "reflect-metadata"
import {contextBridge} from 'electron'
import {container} from 'tsyringe'
import {PreloadedApi} from './preloaded/preloaded-api'


const preloadedApi = container.resolve(PreloadedApi)
preloadedApi.preload()
contextBridge.exposeInMainWorld('main', preloadedApi)


export {PreloadedApi} from './preloaded/preloaded-api'
