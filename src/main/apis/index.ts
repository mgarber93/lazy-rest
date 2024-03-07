import {ipcMain, IpcMainInvokeEvent} from 'electron';
import {getUser} from './user';
import {chat, getModels} from './openai';

async function handleChat(event: IpcMainInvokeEvent, ...args: string[]): Promise<string> {
  if (args.join('').startsWith('test')) {
    return 'Why did the coffee file a police report? It got mugged!\n';
  }
  return chat(args.join())
}

// Handles added here need to be registered src/preload.ts
export function registerHandlers() {
  ipcMain.handle('getModels', getModels)
  ipcMain.handle('chat', handleChat)
  ipcMain.handle('getMachineName', getUser)
}
