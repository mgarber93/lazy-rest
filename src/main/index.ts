import {ipcMain, IpcMainInvokeEvent} from 'electron';
import {getUser} from './user';
import {chat, getModels, streamedChat} from './openai';
import {Conversation} from '../models/conversation';
import {loadOasSpec} from './oas-loader';
import {TApi} from '../prompts/api-to-icl-examples';
import {apiAgentLoop} from './api-loop';

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

// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  ipcMain.handle('apiAutoPrompt', handleApiAutoPrompt)
  ipcMain.handle('getModels', getModels)
  ipcMain.handle('getMachineName', getUser)
  ipcMain.handle('chat', handleChat)
  ipcMain.handle('loadOasSpec', handleLoadOasSpec);
  ipcMain.handle('streamedChat', handleStreamedChat)
}
