import {OpenApiSpec} from '../../models/open-api-spec'
import {v4} from 'uuid'
import windowSender from './window-sender'

export async function loadOas(): Promise<OpenApiSpec[]> {
  try {
    const response = await windowSender.asyncSend("load-oas")
    return response
  } catch (error) {
    console.error(error)
  }
}