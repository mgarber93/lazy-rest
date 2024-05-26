import {ipcMain, IpcMainInvokeEvent} from 'electron'
import {OpenAiConfiguration} from '../models/provider-config'
import providerManager from './providers/provider-manager'
import {getUser} from './utils/user'
import {Conversation} from '../models/conversation'
import {TProvider} from '../models/responder'
import windowSender from './utils/window-sender'
import {getAllProviderModels, streamedChat} from './tools/api'
import {AuthoredContent} from '../models/content'
import {detailCallInPlan, TAgent} from './organizations/swagger-gpt'
import {HttpRequestPlan} from '../models/http-request-plan'
import {approveCallingPlan, get} from './tools/http'
import {PreloadableApi} from '../models/preloadable-api'
import {GetModelsHandler} from './preloaded-handlers/get-models'

async function handleStreamedChat(event: IpcMainInvokeEvent, conversation: Conversation): Promise<void> {
  await streamedChat(conversation.responder, conversation)
}

async function handleGetModels(event: IpcMainInvokeEvent, provider: TProvider) {
  const models = await getAllProviderModels(provider)
  return models
}

async function handleSetOpenAiConfiguration(event: IpcMainInvokeEvent, config: OpenAiConfiguration): Promise<void> {
  providerManager.setOpenAiConfig(config)
}

async function handleCallback(event: IpcMainInvokeEvent, id: string, arg: any) {
  return windowSender.callback(id, arg)
}

async function handleDetailCallInPlan(event: IpcMainInvokeEvent, userContent: AuthoredContent, plan: HttpRequestPlan) {
  return detailCallInPlan(userContent, plan)
}

async function processHttpRequest(event: IpcMainInvokeEvent, call: HttpRequestPlan) {
  const token = await approveCallingPlan(null)

  switch (call.method) {
    case "GET": {
      const response = await get(token, call.path)
      console.log(JSON.stringify(response, null, 2))
      return response
    }
  }
  throw new Error(`Not implemented`)
}

// essentially needs everything for the parsing prompt, and the parser
async function streamAgentResponse(event: IpcMainInvokeEvent, conversation: Conversation, agent: TAgent) {
  await streamedChat(conversation.responder, conversation)
}

const preloadAbleApi = new PreloadableApi()
// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  [
    GetModelsHandler,
  ].forEach((Handler) => {
    const handler = new Handler()
    ipcMain.handle(handler.channel, handler.handle)
  })
  ipcMain.handle('getMachineName', getUser)
  ipcMain.handle('streamedChat', handleStreamedChat)
  ipcMain.handle('setOpenAiConfiguration', handleSetOpenAiConfiguration)
  ipcMain.handle('callback', handleCallback)
  ipcMain.handle('detailCallInPlan', handleDetailCallInPlan)
  ipcMain.handle('httpCall', processHttpRequest)
  ipcMain.handle(streamAgentResponse.toString(), streamAgentResponse)
}
