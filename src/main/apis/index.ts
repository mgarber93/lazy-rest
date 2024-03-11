import {ipcMain, IpcMainInvokeEvent} from 'electron';
import {getUser} from './user';
import {chat, getModels} from './openai';
import {Conversation} from '../../models/conversation';
import {loadOasSpec} from './oas-loader';
import {TApi} from '../../prompts/api-to-icl-examples';
import {types} from 'sass';
import Error = types.Error;

async function handleChat(event: IpcMainInvokeEvent, ...args: string[]): Promise<string> {
  const conversation = JSON.parse(args.join('')) as Conversation;
  if (!conversation) {
    throw new Error('Unable to parse in handleChat');
  }
  return chat(conversation.responder, conversation.content);
}

async function handleLoadOasSpec(event: IpcMainInvokeEvent, ...args: string[]): Promise<string> {
  const api = args[0] as TApi;
  if (!api) {
    throw new Error('Unable to parse in handleLoadOasSpec');
  }
  const spec = await loadOasSpec(api);
  return JSON.stringify(spec);
}

// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  ipcMain.handle('getModels', getModels)
  ipcMain.handle('getMachineName', getUser)
  ipcMain.handle('chat', handleChat)
  ipcMain.handle('loadOasSpec', handleLoadOasSpec);
}
