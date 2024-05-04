import {ipcMain, IpcMainInvokeEvent} from 'electron'
import {OpenAiConfiguration} from '../models/provider-config'
import providerManager from './providers/provider-manager'
import {getUser} from './utils/user'
import {Conversation} from '../models/conversation'
import {TProvider} from '../models/responder'
import windowSender from './utils/window-sender'
import {getAllProviderModels, streamedChat} from './tools/api'
import {AuthoredContent} from '../models/content'
import {detailCallInPlan} from './organizations/swagger-gpt'
import {EndpointCallPlan} from '../models/endpoint'
import {HttpRequest} from '../models/http'
import {approveCallingPlan, get} from './tools/http'

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

async function handleDetailCallInPlan(event: IpcMainInvokeEvent, userContent: AuthoredContent, plan: EndpointCallPlan) {
  return detailCallInPlan(userContent, plan)
}

async function processHttpRequest(event: IpcMainInvokeEvent, call: HttpRequest) {
  const token = await approveCallingPlan(null)

  switch (call.verb) {
    case "GET": {
      await get(token, call.url)
    }
  }
}

// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  ipcMain.handle('getModels', handleGetModels)
  ipcMain.handle('getMachineName', getUser)
  ipcMain.handle('streamedChat', handleStreamedChat)
  ipcMain.handle('setOpenAiConfiguration', handleSetOpenAiConfiguration)
  ipcMain.handle('callback', handleCallback)
  ipcMain.handle('detailCallInPlan', handleDetailCallInPlan)
  ipcMain.handle('get', processHttpRequest)
}
