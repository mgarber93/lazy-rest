import {ipcMain, IpcMainInvokeEvent} from 'electron'
import {OpenAiConfiguration} from '../models/provider-config'
import providerManager from './providers/provider-manager'
import {getUser} from './utils/user'
import {Conversation} from '../models/conversation'
import {TProvider} from '../models/responder'
import windowSender from './utils/window-sender'
import {getAllProviderModels, streamedChat} from './tools/api'


/**
 *
 * @param event
 * @param conversation
 * @param responseId - The response is streamed into an authored content object, found by responseId
 */
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

// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  ipcMain.handle('getModels', handleGetModels)
  ipcMain.handle('getMachineName', getUser)
  ipcMain.handle('streamedChat', handleStreamedChat)
  ipcMain.handle('setOpenAiConfiguration', handleSetOpenAiConfiguration)
  ipcMain.handle('callback', handleCallback)
}
