import {ipcMain, IpcMainInvokeEvent} from 'electron';
import {getUser} from './user';
import {chat, getModels} from './openai';
import {Conversation} from '../../models/conversation';

async function handleChat(event: IpcMainInvokeEvent, ...args: string[]): Promise<string> {
  const conversation = JSON.parse(args.join('')) as Conversation;
  if (!conversation) {
    throw new Error('Unable to parse in handleChat');
  }
  return chat(conversation.responder, conversation.content);
}

// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  ipcMain.handle('getModels', getModels)
  ipcMain.handle('chat', handleChat)
  ipcMain.handle('getMachineName', getUser)
}
