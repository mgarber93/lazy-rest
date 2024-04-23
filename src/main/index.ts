import {ipcMain, IpcMainInvokeEvent} from 'electron';
import {OpenAiConfiguration} from '../models/provider-config';
import providerManager from './provider-manager';
import {getUser} from './user';
import {Conversation} from '../models/conversation';
import {restApiOrganization} from './api-loop';
import {chat, getModels, streamedChat} from './api/api';
import {TProvider} from '../models/responder';
import windowSender from './window-sender';

async function handleChat(event: IpcMainInvokeEvent, conversation: Conversation): Promise<{
  content: string,
  role: string
}> {
  if (!conversation) {
    throw new Error('Unable to parse in handleChat');
  }
  return chat(conversation.responder, conversation.content);
}

async function handleApiAutoPrompt(event: IpcMainInvokeEvent, conversation: Conversation): Promise<{
  content: string,
  role: string
}> {
  if (!conversation) {
    throw new Error('Missing requirement conversation');
  }
  return restApiOrganization(conversation);
}

async function handleStreamedChat(event: IpcMainInvokeEvent, conversation: Conversation, responseId: string): Promise<void> {
  const contentToRespondTo = conversation.content.filter(content => content.id !== responseId);
  await streamedChat(conversation.responder, contentToRespondTo, conversation.id, responseId);
}

async function handleGetModels(event: IpcMainInvokeEvent, provider: TProvider) {
  const models = await getModels(provider)
  return models;
}

async function handleSetOpenAiConfiguration(event: IpcMainInvokeEvent, config: OpenAiConfiguration): Promise<void> {
  providerManager.setOpenAiConfig(config);
}

async function handleCallback(event: IpcMainInvokeEvent, id: string, arg: any) {
  windowSender.callback(id, arg)
}

// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  ipcMain.handle('apiAutoPrompt', handleApiAutoPrompt)
  ipcMain.handle('getModels', handleGetModels)
  ipcMain.handle('getMachineName', getUser)
  ipcMain.handle('chat', handleChat)
  ipcMain.handle('streamedChat', handleStreamedChat);
  ipcMain.handle('setOpenAiConfiguration', handleSetOpenAiConfiguration);
  ipcMain.handle('callback', handleCallback);
}
