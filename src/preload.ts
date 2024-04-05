// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer} from 'electron';
import {TApi} from './prompts/api-to-icl-examples';
import {Conversation} from './models/conversation';
import {TChannel} from './main/window-sender';
import {TProvider} from './models/responder';

export interface PreloadedApi {
  getMachineName: () => Promise<string>;
  getModels: (provider: TProvider) => Promise<string>;
  chat: (conversation: Conversation) => Promise<{ content: string, role: string }>;
  streamedChat: (conversation: Conversation, responseId: string) => Promise<void>;
  loadOasSpec: (api: TApi) => Promise<string>;
  apiAutoPrompt: (conversation: Conversation) => Promise<{ content: string, role: string }>;
  receive: (channel: TChannel, func: (...args: any[]) => void) => void;
  remove: (channel: TChannel, func: (...args: any[]) => void) => void;
}

const validChannels: TChannel[] = ['message-delta', 'tool-request'];
let count = 0;

contextBridge.exposeInMainWorld('main', {
  desktop: true,
  apiAutoPrompt: ipcRenderer.invoke.bind(ipcRenderer, 'apiAutoPrompt'),
  chat: ipcRenderer.invoke.bind(ipcRenderer, 'chat'),
  streamedChat: ipcRenderer.invoke.bind(ipcRenderer, 'streamedChat'),
  getMachineName: ipcRenderer.invoke.bind(ipcRenderer, 'getMachineName'),
  getModels: ipcRenderer.invoke.bind(ipcRenderer, 'getModels'),
  loadOasSpec: ipcRenderer.invoke.bind(ipcRenderer, 'loadOasSpec'),
  send: (channel: TChannel, data: any) => {
    // whitelist channels
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: TChannel, func: (...args: any[]) => void) => {
    if (!validChannels.includes(channel)) {
      console.error(channel);
      return
    }
    ipcRenderer.addListener(channel, func);
  },
  remove: (channel: TChannel, func: (...args: any[]) => void) => {
    if (!validChannels.includes(channel)) {
      console.error(channel);
      return
    }
    // @todo rework to remove first argument for func. Maybe Record<TChannel, cb[]>?
    ipcRenderer.removeAllListeners(channel);
  },
} as PreloadedApi)