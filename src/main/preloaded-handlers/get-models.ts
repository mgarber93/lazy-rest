import {TProvider} from '../../models/responder'
import {getAllProviderModels} from '../tools/api'
import {IpcMainInvokeEvent} from 'electron'


export class GetModelsHandler {
  channel = 'getModels'
  
  async handle(event: IpcMainInvokeEvent, provider: TProvider) {
    console.log('GetModelsHandler:handle')
    const models = await getAllProviderModels(provider)
    return models
  }
}