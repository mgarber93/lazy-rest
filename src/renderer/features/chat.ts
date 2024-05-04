import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AuthoredContent, ContentDelta} from '../../models/content'
import {Conversation, createConversation, PlanController} from '../../models/conversation'
import {Responder} from '../../models/responder'
import {RootState} from './store'
import {EndpointCallPlan} from '../../models/endpoint'

const serializedChats = localStorage.getItem('chats')
const chats = JSON.parse(serializedChats)
const initialState: Conversation[] = chats ?? [createConversation()]
const name = 'chats'

export const streamResponse = createAsyncThunk(
  `${name}/streamResponse`,
  async (arg: { conversationId: string }, thunkAPI) => {
    const {conversationId} = arg
    const state = thunkAPI.getState() as RootState
    await window.main.setOpenAiConfiguration(state.models.providers.openAi)
    const conversation = state.chats.find(chat => chat.id === conversationId)

    // Cant respond unless a responder is set
    if (!conversation || !conversation.responder)
      return null

    await window.main.streamedChat(conversation)
  },
)

export const detailCallInPlan = createAsyncThunk(
  `${name}/detailCallInPlan`,
  async (arg: {plan: EndpointCallPlan, chatId: string}, thunkAPI) => {
    const {chatId, plan} = arg
    const state = thunkAPI.getState() as RootState
    await window.main.setOpenAiConfiguration(state.models.providers.openAi)
    const chat = state.chats.find(chat => chat.id === chatId)
    // assume users query is the last message?
    const userQuery = chat.content.at(-1)
    const detailedPlan = await window.main.detailCallInPlan(userQuery, plan)
    return {chatId, detailedPlan}
  }
)

export const executeCall = createAsyncThunk(
  `${name}/executeCall`,
  async (arg: {call: EndpointCallPlan}, thunkAPI) => {
    await window.main.executeCalls()
  }
)

export const chatsSlice = createSlice({
  name,
  initialState,
  reducers: {
    respond: (state, action: PayloadAction<AuthoredContent>) => {
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
    startNewChat: (state, action: PayloadAction<Conversation | null>) => {
      if (action.payload) {
        const newChat = {...action.payload, created: Date()}
        state.push(newChat)
      } else {
        const newChat: Conversation = createConversation()
        state.push(newChat)
      }
    },
    updateTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
      const chat = state.find(chat => chat.id === action.payload.id)
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
    selectModelChat: (state, action: PayloadAction<{ chat: string, model: Responder }>) => {
      const {chat, model} = action.payload
      const conversationIndex = state.findIndex(conversation => conversation.id === chat)
      if (conversationIndex === -1) {
        return state
      }
      state[conversationIndex].responder = model
    },
    setEndpointCallingPlan: (state, action: PayloadAction<{chatId: string, endpointCallingPlan: EndpointCallPlan[]}>) => {
      const {chatId, endpointCallingPlan} = action.payload
      const conversation = state.find(conversation => conversation.id === chatId)
      if (conversation) {
        conversation.planController = {
          endpointCallingPlan
        } as PlanController
      }
    },
    setResponder: (state, action: PayloadAction<{responder: Responder, chatId: string}>) => {
      const {chatId, responder} = action.payload
      const foundChat = state.find(chat => chat.id === chatId)
      if (!foundChat) {
        console.error('no matching chat found when setting responder')
      }
      foundChat.responder = responder
    },
  },
  extraReducers: (builder) => {
    builder.addCase(detailCallInPlan.fulfilled, (state, action) => {
      // handle the fulfilled case here
      // you will use the `state` and `action` parameters to modify the state accordingly
      const {chatId, detailedPlan} = action.payload
      const chat = state.find(chat => chat.id === chatId)
      if (!chat.planController.detailedPlan) {
        chat.planController.detailedPlan = []
      }
      chat.planController.detailedPlan.push(detailedPlan)
    })
  },
})

// Export actions to use dispatch in component
export const {
  respond,
  startNewChat,
  removeChat,
  selectModelChat,
  setEndpointCallingPlan,
  updateTitle,
  appendDelta,
  setResponder,
} = chatsSlice.actions


