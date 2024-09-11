import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AuthoredContent, ContentDelta} from '../../models/content'
import {Conversation, createConversation} from '../../models/conversation'
import {Responder} from '../../models/responder'
import {RootState} from './store'

const name = 'chats'


export const streamResponse = createAsyncThunk(
  `${name}/streamResponse`,
  async (arg: { conversationId: string }, thunkAPI) => {
    const {conversationId} = arg
    const state = thunkAPI.getState() as RootState
    if (!state.models.providers.openAi) {
      console.error('invalid open ai config')
      return
    }
    await window.main.setOpenAiConfiguration(state.models.providers.openAi)
    const conversation = state.chats.find(chat => chat.id === conversationId)
    
    // Cant respond unless a responder is set
    if (!conversation || !conversation.responder)
      return null
    
    await window.main.streamedChat(conversation)
  },
)


export const chatsSlice = createSlice({
  name,
  initialState: [createConversation()],
  reducers: {
    appendContent: (state, action: PayloadAction<AuthoredContent>) => {
      const {id, chatId} = action.payload
      if (!id)
        throw new Error('no id')
      const conversation = state.find(conversation => conversation.id === chatId)
      if (!conversation) {
        return state
      }
      const contentIndex = conversation.content.findIndex(m => m.id === id)
      if (contentIndex > -1) {
        conversation.content[contentIndex] = action.payload
      } else {
        conversation.content.push(action.payload)
      }
      return state
    },
    appendDelta: (state, action: PayloadAction<ContentDelta>) => {
      const {chatId, messageId, delta} = action.payload
      const conversation = state.find(conversation => conversation.id === chatId)
      if (!conversation) {
        return state
      }
      const chat = conversation.content.find(content => content.id === messageId)
      if (!chat) {
        return state
      }
      chat.message += delta
      return state
    },
    startNewChat: (state, action: PayloadAction<Conversation>) => {
      if (action.payload) {
        const newChat = {...action.payload, created: Date()}
        state.push(newChat)
      } else {
        console.error(`No conversation provided to start`)
      }
    },
    updateTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
      const chat = state.find(chat => chat.id === action.payload.id)
      if (!chat) {
        console.error(`Chat with id ${action.payload.id} not found when updating title`)
        return state
      }
      if (action.payload.title) {
        chat.title = action.payload.title.slice(0, 14)
      } else {
        const index = state.findIndex(chat => chat.id === action.payload.id)
        chat.title = 'chat' + index
      }
    },
    removeChat: (state, action: PayloadAction<string>) => {
      return state.filter(chat => chat.id !== action.payload)
    },
    setResponder: (state, action: PayloadAction<{ responder: Responder, chatId: string }>) => {
      const {chatId, responder} = action.payload
      const foundChat = state.find(chat => chat.id === chatId)
      if (!foundChat) {
        console.error(`Chat with id ${chatId} not found when updating title`)
        return state
      }
      if (!foundChat) {
        console.error('no matching chat found when setting responder')
      }
      foundChat.responder = responder
    },
  },
})

// Export actions to use dispatch in component
export const {
  appendContent,
  startNewChat,
  removeChat,
  updateTitle,
  appendDelta,
  setResponder,
} = chatsSlice.actions


