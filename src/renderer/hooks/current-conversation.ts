import {useSelector} from 'react-redux'
import {RootState} from '../features/store'
import {Conversation} from '../../models/conversation'
import {ToolState} from '../features/tools'

export const useCurrentConversation = () => {
  const currentChat = useSelector<RootState>((state) => state.currentChat) as string
  const chats = useSelector<RootState>(state => state.chats) as Conversation[]
  return chats.find(chat => chat.id === currentChat)
}

export const useCurrentTools = () => {
  const tools = useSelector<RootState>((state) => state.tools)
  return tools as ToolState
}
