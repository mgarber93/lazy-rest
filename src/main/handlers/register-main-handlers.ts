import {container} from 'tsyringe'
import {streamedChat} from './streamed-chat'
import {getUser} from './user'
import {callback, handleSetOpenAiConfiguration, processHttpRequest} from './set-config'
import {detailCallInPlan, TAgent} from '../organizations/swagger-gpt'
import {handle} from './get-models'
import {Conversation} from '../../models/conversation'
import {INVOKE_CHANNELS, PreloadedApi, TInvokeChannel} from '../../preloader/preloaded-api'

async function streamAgentResponse(convo: Conversation, agent: TAgent) {
  return
}

export function registerMainHandlers() {
  container.register<TInvokeChannel[]>('InvokeChannels', {useValue: INVOKE_CHANNELS})
  container.register<PreloadedApi['streamedChat']>('streamedChat', {useValue: streamedChat})
  container.register<PreloadedApi['getMachineName']>('getMachineName', {useValue: getUser})
  container.register<PreloadedApi['httpCall']>('httpCall', {useValue: processHttpRequest})
  container.register<PreloadedApi['detailCallInPlan']>('detailCallInPlan', {useValue: detailCallInPlan})
  container.register<PreloadedApi['callback']>('callback', {useValue: callback})
  container.register<PreloadedApi['setOpenAiConfiguration']>('setOpenAiConfiguration', {useValue: handleSetOpenAiConfiguration})
  container.register<PreloadedApi['getModels']>('getModels', {useValue: handle})
  container.register<PreloadedApi['streamAgentResponse']>('streamAgentResponse', {useValue: streamAgentResponse})
}
