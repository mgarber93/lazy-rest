import {TProvider} from '../../models/responder'
import {getAllProviderModels} from '../tools/api'
import {IpcMainInvokeEvent} from 'electron'


export class GetModelsHandler {
  channel = 'getModels'
  
  constructor() {
    this.handle = this.handle.bind(this)
  }
  
  async handle(event: IpcMainInvokeEvent, provider: TProvider) {
    console.log('hello world')
    const models = await getAllProviderModels(provider)
    return models
  }
}