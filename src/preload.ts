// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer} from 'electron';
import {User} from './models/user';

export interface PreloadedApi {
  chat: (...args: string[]) => Promise<string>,
  getUser: () => Promise<User>
}


contextBridge.exposeInMainWorld('main', {
  desktop: true,
  chat: ipcRenderer.invoke.bind(ipcRenderer, 'chat'),
  getUser: ipcRenderer.invoke.bind(ipcRenderer, 'getUser'),
} as PreloadedApi)