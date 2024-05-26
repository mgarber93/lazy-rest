import {GetModels} from '../../models/responder'

// renderer side interface
export interface ModelProvider {
  getModels: GetModels
}
