import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../features/store"
import { Conversation, createConversation } from "../../models/conversation"
import { ToolState } from "../features/tools"

import { startNewChat } from "../features/chat"
import { useParams } from "react-router-dom"

export const useCurrentConversation = () => {
  const params = useParams()
  const currentChat = params["chatId"]
  const chats = useSelector<RootState>((state) => state.chats) as Conversation[]
  let current = chats.find((chat) => chat.id === currentChat)
  const dispatch = useDispatch()
  if (chats.length === 0) {
    current = createConversation()
    dispatch(startNewChat(current))
  } else if (!current) {
    current = chats[0]
  }

  return current as Conversation
}

export const useCurrentTools = () => {
  const tools = useSelector<RootState>((state) => state.tools)
  return tools as ToolState
}
