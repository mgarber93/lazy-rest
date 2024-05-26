import {ipcMain, IpcMainInvokeEvent} from 'electron'

import {container} from 'tsyringe'
import {INVOKE_CHANNELS, PreloadedApi} from '../preloader/preloaded-api'
import {streamedChat} from '../preloader/handlers/streamed-chat'
import {getUser} from '../preloader/handlers/user'
import {detailCallInPlan, TAgent} from './organizations/swagger-gpt'
import {callback, handleSetOpenAiConfiguration, processHttpRequest} from '../preloader/handlers/set-config'
import {handle} from '../preloader/handlers/get-models'
import {Conversation} from '../models/conversation'

async function streamAgentResponse(convo: Conversation, agent: TAgent) {
  return
}

container.register<PreloadedApi['streamedChat']>('streamedChat', {useValue: streamedChat})
container.register<PreloadedApi['getMachineName']>('getMachineName', {useValue: getUser})
container.register<PreloadedApi['httpCall']>('httpCall', {useValue: processHttpRequest})
container.register<PreloadedApi['detailCallInPlan']>('detailCallInPlan', {useValue: detailCallInPlan})
container.register<PreloadedApi['callback']>('callback', {useValue: callback})
container.register<PreloadedApi['setOpenAiConfiguration']>('setOpenAiConfiguration', {useValue: handleSetOpenAiConfiguration})
container.register<PreloadedApi['getModels']>('getModels', {useValue: handle})
container.register<PreloadedApi['streamAgentResponse']>('streamAgentResponse', {useValue: streamAgentResponse})

// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  INVOKE_CHANNELS.forEach((invokeChannel) => {
    const handler = container.resolve<PreloadedApi[keyof PreloadedApi]>(invokeChannel)
    ipcMain.handle(invokeChannel, (event: IpcMainInvokeEvent, ...rest: any[]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return handler(...rest)
    })
  })
}
