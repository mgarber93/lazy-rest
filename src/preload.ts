// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer} from 'electron';
import {TApi} from './prompts/api-to-icl-examples';

export interface PreloadedApi {
  getMachineName: () => Promise<string>,
  getModels: () => Promise<string>,
  chat: (...args: string[]) => Promise<string>,
  loadOasSpec: (api: TApi) => Promise<string>
}


contextBridge.exposeInMainWorld('main', {
  desktop: true,
  chat: ipcRenderer.invoke.bind(ipcRenderer, 'chat'),
  getMachineName: ipcRenderer.invoke.bind(ipcRenderer, 'getMachineName'),
  getModels: ipcRenderer.invoke.bind(ipcRenderer, 'getModels'),
  loadOasSpec: ipcRenderer.invoke.bind(ipcRenderer, 'loadOasSpec'),
} as PreloadedApi)