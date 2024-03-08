import {ipcMain, IpcMainInvokeEvent} from 'electron';
import {getUser} from './user';
import {chat, getModels} from './openai';

async function handleChat(event: IpcMainInvokeEvent, ...args: string[]): Promise<string> {
  const chatRequest = JSON.parse(args.join(''))
  if (!chatRequest) {
    throw new Error('Unable to parse in handleChat');
  }
  return chat(chatRequest.model, chatRequest.message);
}

// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  ipcMain.handle('getModels', getModels)
  ipcMain.handle('chat', handleChat)
  ipcMain.handle('getMachineName', getUser)
}
