import {ipcRenderer} from 'electron'
import {container, injectable} from 'tsyringe'
import {ModelProvider} from '../main/preloaded-invokers/get-models'
import {channelAllowList, TWindowSenderChannel} from '../models/window-sender'

export type TInvokeChannel = keyof PreloadedApi

@injectable()
export class PreloadedApi implements ModelProvider {
  hasPreloaded = false
  streamedChat = ipcRenderer.invoke.bind(ipcRenderer, 'streamedChat')
  getMachineName = ipcRenderer.invoke.bind(ipcRenderer, 'getMachineName')
  loadOasSpec = ipcRenderer.invoke.bind(ipcRenderer, 'loadOasSpec')
  setOpenAiConfiguration = ipcRenderer.invoke.bind(ipcRenderer, 'setOpenAiConfiguration')
  callback = ipcRenderer.invoke.bind(ipcRenderer, 'callback')
  detailCallInPlan = ipcRenderer.invoke.bind(ipcRenderer, 'detailCallInPlan')
  executeCalls = ipcRenderer.invoke.bind(ipcRenderer, 'executeCalls')
  httpCall = ipcRenderer.invoke.bind(ipcRenderer, 'httpCall')
  streamAgentResponse = ipcRenderer.invoke.bind(ipcRenderer, 'streamAgentResponse')

  send = (channel: TWindowSenderChannel, data: any) => {
    if (channelAllowList.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  }

  receive = (channel: TWindowSenderChannel, func: (...args: any[]) => void) => {
    if (!channelAllowList.includes(channel)) {
      console.error(channel)
      return
    }
    ipcRenderer.addListener(channel, func)
  }

  remove = (channel: TWindowSenderChannel, func: (...args: any[]) => void) => {
    if (!channelAllowList.includes(channel)) {
      console.error(channel)
      return
    }
    ipcRenderer.removeAllListeners(channel)
  }

  preload = () => {
    this.hasPreloaded = true
  }
  
  getModels(openai: string) {
    return ipcRenderer.invoke('getModels', openai) as Promise<string>
  }
}

container.register(PreloadedApi, PreloadedApi)
