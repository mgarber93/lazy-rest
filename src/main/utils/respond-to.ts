import {Conversation} from '../../models/conversation'
import windowSender from './window-sender'
import {AuthoredContent} from '../../models/content'
import {CallingPlan} from '../../models/approvable'
import {EndpointCallPlan} from '../../models/endpoint'


export async function respondTo(chatId: string, author: string): Promise<AuthoredContent> {
  const content = await windowSender.asyncSend('respond-to', chatId)
  return content
}

export async function presentCallingPlan(chatId: string, calls: EndpointCallPlan[]) {
  windowSender.send('calling-plan', chatId, calls)
}