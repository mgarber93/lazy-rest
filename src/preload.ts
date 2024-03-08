// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer} from 'electron';

export interface PreloadedApi {
  chat: (...args: string[]) => Promise<string>,
  getMachineName: () => Promise<string>,
  getModels: () => Promise<string>
}


contextBridge.exposeInMainWorld('main', {
  desktop: true,
  chat: ipcRenderer.invoke.bind(ipcRenderer, 'chat'),
  getMachineName: ipcRenderer.invoke.bind(ipcRenderer, 'getMachineName'),
  getModels: ipcRenderer.invoke.bind(ipcRenderer, 'getModels'),
} as PreloadedApi)