import {v4} from 'uuid'
import {AuthoredContent} from './content'
import {Responder} from './responder'
import {ToolState} from '../renderer/features/tools'

export function createConversation(id?: string): Conversation {
  return {
    id: id ?? v4(),
    content: [] as AuthoredContent[],
    title: '',
    created: Date(),
  }
}


export interface Conversation {
  id: string
  content: AuthoredContent[]
  title: string
  created: string
  responder?: Responder
}


export interface ConversationId {
  id: string
}

export interface PlanId {
  id: string
}


export interface ConversationContext {
  conversationId: ConversationId
  planId: PlanId
  toolState: ToolState
}
