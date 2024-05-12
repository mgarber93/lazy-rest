import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AuthoredContent, ContentDelta} from '../../models/content'
import {Conversation, createConversation, Plan} from '../../models/conversation'
import {Responder} from '../../models/responder'
import {RootState} from './store'
import {HttpRequestPlan} from '../../models/http-request-plan'

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
  async (arg: {plan: HttpRequestPlan, chatId: string}, thunkAPI) => {
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
  async ({call, chatId}: { call: HttpRequestPlan, chatId: string }, thunkAPI) => {
    const response = await window.main.httpCall(call)
    return {response, chatId}
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
    setEndpointCallingPlan: (state, action: PayloadAction<{chatId: string, endpointCallingPlan: HttpRequestPlan[]}>) => {
      const {chatId, endpointCallingPlan} = action.payload
      const conversation = state.find(conversation => conversation.id === chatId)
      if (conversation) {
        conversation.planController = {
          endpointCallingPlan
        } as Plan
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
      const {chatId, detailedPlan} = action.payload
      const chat = state.find(chat => chat.id === chatId)
      const planController = chat.planController
      if (!planController.endpointCallingPlan) {
        planController.endpointCallingPlan = []
      }
      // @todo its not as simple as pushing another call at the end. Need to find and replace or overhaul regenerate
      planController.endpointCallingPlan.push(detailedPlan)
      planController.results = []
    })
    builder.addCase(executeCall.fulfilled, (state, action) => {
      const {response, chatId} = action.payload
      if (response) {
        const chat = state.find(chat => chat.id === chatId)
        if (!chat.planController.results) {
          chat.planController.results = []
        }
        chat.planController.results.push(response)
      }
    })
  },
})

// Export actions to use dispatch in component
export const {
  respond,
  startNewChat,
  removeChat,
  setEndpointCallingPlan,
  updateTitle,
  appendDelta,
  setResponder,
} = chatsSlice.actions


