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

// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  ipcMain.handle('getModels', handleGetModels)
  ipcMain.handle('getMachineName', getUser)
  ipcMain.handle('streamedChat', handleStreamedChat)
  ipcMain.handle('setOpenAiConfiguration', handleSetOpenAiConfiguration)
  ipcMain.handle('callback', handleCallback)
  ipcMain.handle('detailCallInPlan', handleDetailCallInPlan)
}
