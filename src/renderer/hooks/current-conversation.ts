import {useSelector,useDispatch} from 'react-redux'
import {RootState} from '../features/store'
import {Conversation, createConversation} from '../../models/conversation'
import {ToolState} from '../features/tools'

import {startNewChat} from '../features/chat'
import {selectChat} from '../features/current-chat'

export const useCurrentConversation = () => {
  const currentChat = useSelector<RootState>((state) => state.currentChat) as string
  const chats = useSelector<RootState>(state => state.chats) as Conversation[]
  let current = chats.find(chat => chat.id === currentChat)
  const dispatch = useDispatch()
  if (chats.length === 0) {
    current = createConversation()
    dispatch(startNewChat(current))
    dispatch(selectChat(current.id))
  } else if (!current) {
    dispatch(selectChat(chats[0].id))
    current = chats[0]
  }
  
  return current as Conversation
}

export const useCurrentTools = () => {
  const tools = useSelector<RootState>((state) => state.tools)
  return tools as ToolState
}
