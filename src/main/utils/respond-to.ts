import windowSender from './window-sender'
import {AuthoredContent} from '../../models/content'
import {HttpRequestPlan} from '../../models/http-request-plan'


export async function respondTo(chatId: string, author: string): Promise<AuthoredContent> {
  const content = await windowSender.asyncSend('respond-to', chatId)
  return content
}

export async function presentCallingPlan(chatId: string, calls: HttpRequestPlan[]) {
  windowSender.send('calling-plan', chatId, calls)
}