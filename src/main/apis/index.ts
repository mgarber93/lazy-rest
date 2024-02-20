import {ipcMain, IpcMainInvokeEvent} from 'electron';
import {getUser} from './user';
import {chat} from './openai';

async function handleChat(event: IpcMainInvokeEvent, ...args: string[]): Promise<string> {
  return chat(args.join())
}


export function registerHandlers() {
  ipcMain.handle('chat', handleChat)
  ipcMain.handle('getMachineName', getUser)
}
