// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer} from 'electron';
import {TApi} from './prompts/api-to-icl-examples';
import {Conversation} from './models/conversation';

export interface PreloadedApi {
  getMachineName: () => Promise<string>,
  getModels: () => Promise<string>,
  chat: (conversation: Conversation) => Promise<{content: string, role: string}>,
  loadOasSpec: (api: TApi) => Promise<string>,
  apiAutoPrompt: (conversation: Conversation) => Promise<{content: string, role: string}>,
}


contextBridge.exposeInMainWorld('main', {
  desktop: true,
  apiAutoPrompt: ipcRenderer.invoke.bind(ipcRenderer, 'apiAutoPrompt'),
  chat: ipcRenderer.invoke.bind(ipcRenderer, 'chat'),
  getMachineName: ipcRenderer.invoke.bind(ipcRenderer, 'getMachineName'),
  getModels: ipcRenderer.invoke.bind(ipcRenderer, 'getModels'),
  loadOasSpec: ipcRenderer.invoke.bind(ipcRenderer, 'loadOasSpec'),
} as PreloadedApi)