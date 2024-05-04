// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import {contextBridge, ipcRenderer} from 'electron'
import {Conversation} from './models/conversation'
import {TChannel, channelAllowList} from './main/utils/window-sender'
import {TProvider} from './models/responder'
import {OpenAiConfiguration} from './models/provider-config'
import {AuthoredContent} from './models/content'
import {CallingPlan} from './models/approvable'
import {OpenApiSpec} from './models/open-api-spec'
import {DetailedCall, EndpointCallPlan} from './models/endpoint'

export interface PreloadedApi {
  getMachineName: () => Promise<string>
  getModels: (provider: TProvider) => Promise<string>
  streamedChat: (conversation: Conversation) => Promise<void>
  receive: (channel: TChannel, func: (...args: any[]) => void) => void
  remove: (channel: TChannel, func: (...args: any[]) => void) => void
  setOpenAiConfiguration: (config: OpenAiConfiguration) => Promise<void>
  callback: (id: string, arg: any) => void
  detailCallInPlan: (userContent: AuthoredContent, callingPlan: EndpointCallPlan) => Promise<DetailedCall>
  executeCalls: (userContent: AuthoredContent, callingPlan: CallingPlan, oasSpec: OpenApiSpec[]) => Promise<DetailedCall> // deprecate
  get: (call: EndpointCallPlan) => Promise<object>
}

contextBridge.exposeInMainWorld('main', {
  desktop: true,
  send: (channel: TChannel, data: any) => {
    if (channelAllowList.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel: TChannel, func: (...args: any[]) => void) => {
    if (!channelAllowList.includes(channel)) {
      console.error(channel)
      return
    }
    ipcRenderer.addListener(channel, func)
  },
  remove: (channel: TChannel, func: (...args: any[]) => void) => {
    if (!channelAllowList.includes(channel)) {
      console.error(channel)
      return
    }
    // @todo rework to remove first argument for func. Maybe Record<TChannel, cb[]>?
    ipcRenderer.removeAllListeners(channel)
  },
  streamedChat: ipcRenderer.invoke.bind(ipcRenderer, 'streamedChat'),
  getMachineName: ipcRenderer.invoke.bind(ipcRenderer, 'getMachineName'),
  getModels: ipcRenderer.invoke.bind(ipcRenderer, 'getModels'),
  loadOasSpec: ipcRenderer.invoke.bind(ipcRenderer, 'loadOasSpec'),
  setOpenAiConfiguration: ipcRenderer.invoke.bind(ipcRenderer, 'setOpenAiConfiguration'),
  callback: ipcRenderer.invoke.bind(ipcRenderer, 'callback'),
  detailCallInPlan: ipcRenderer.invoke.bind(ipcRenderer, 'detailCallInPlan'),
  executeCalls: ipcRenderer.invoke.bind(ipcRenderer, 'executeCalls'),
  get: ipcRenderer.invoke.bind(ipcRenderer, 'get'),
} as PreloadedApi)