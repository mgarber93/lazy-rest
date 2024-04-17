import {ipcMain, IpcMainInvokeEvent} from 'electron';
import {OpenAiConfiguration} from '../models/provider-config';
import providerManager from './provider-manager';
import {getUser} from './user';
import {Conversation} from '../models/conversation';
import {loadOasSpec} from './oas-loader';
import {TApi} from '../prompts/api-to-icl-examples';
import {apiAgentLoop} from './api-loop';
import {chat, getModels, streamedChat} from './api/api';
import {TProvider} from '../models/responder';

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
  return apiAgentLoop(conversation);
}

async function handleLoadOasSpec(event: IpcMainInvokeEvent, ...args: string[]): Promise<string> {
  const api = args[0] as TApi;
  if (!api) {
    throw new Error('Unable to parse in handleLoadOasSpec');
  }
  const spec = await loadOasSpec(api);
  return JSON.stringify(spec);
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

// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  ipcMain.handle('apiAutoPrompt', handleApiAutoPrompt)
  ipcMain.handle('getModels', handleGetModels)
  ipcMain.handle('getMachineName', getUser)
  ipcMain.handle('chat', handleChat)
  ipcMain.handle('loadOasSpec', handleLoadOasSpec);
  ipcMain.handle('streamedChat', handleStreamedChat);
  ipcMain.handle('setOpenAiConfiguration', handleSetOpenAiConfiguration)
}
