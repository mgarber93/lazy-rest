import {ipcMain, IpcMainInvokeEvent} from 'electron';
import {getUser} from './user';

async function handleChat(event: IpcMainInvokeEvent, ...args: string[]): Promise<string> {
  return [...args].map(str => str.toUpperCase()).join('')
}


export function registerHandlers() {
  ipcMain.handle('chat', handleChat)
  ipcMain.handle('getUser', getUser)
}