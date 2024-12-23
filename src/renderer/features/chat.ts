import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AuthoredContent, ContentDelta} from '../../models/content'
import {Conversation, createConversation} from '../../models/conversation'
import {Responder} from '../../models/responder'
import {RootState} from './store'
import {ApiCallPlan, HttpRequestPlan, ProgressStage, SummarizationJob} from '../../models/api-call-plan'
import {v4} from 'uuid'
import {toast} from 'sonner'

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
    await window.main.setOpenAiConfiguration(state.models.providers.openAi) // @todo remove
    const conversation = state.chats.find(chat => chat.id === conversationId)
    
    if (!conversation || !conversation.responder) {
      toast.error('Cant respond unless a responder is set')
      return null
    }

    await window.main.streamedChat(conversation)
  },
)

export const handleInterpret = createAsyncThunk(
  `${name}/interpret`,
  async (arg: {job: SummarizationJob, chatId: string, contentId: string}, thunkAPI) => {
    const nextPlan = await window.main.summarizeResponse(arg.job)
    const state = thunkAPI.getState() as RootState
    const chat = state.chats.find(chat => chat.id === arg.chatId)
    
    if (!chat) {
      console.warn(`Chat with id ${arg.chatId} not found`)
      return
    }
    
    const content = chat.content.find(content => content.id === arg.contentId)
    
    if (!content) {
      console.warn(`Content with id ${arg.contentId} not found in chat ${arg.chatId}`)
      return
    }

    if (!content.apiCallPlan) {
      console.warn(`No apiCallPlan found for content ${arg.contentId} in chat ${arg.chatId}`)
      return
    }
    
    const response = await window.main.summarizeResponse(arg.job)
    const index = arg.job.index
    content.apiCallPlan.steps[index] ??= {
      id: v4(),
      step: {},
      progressStage: ProgressStage.active,
    }
    
    // Update the specific step in the apiCallPlan with the summarizeResponse
    Object.assign(content.apiCallPlan.steps[index].step.response!, {interpretation: response})
    
    // Dispatch the updated plan back to the Redux state
    thunkAPI.dispatch(setPlan({
      chatId: arg.chatId,
      contentId: arg.contentId,
      plan: content.apiCallPlan,
    }))
  }
)

export interface UpdateStepActivityPayload {
  chatId: string,
  contentId: string,
  sequenceId: number,
  nextPlan: Partial<HttpRequestPlan>
}

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
    updateStep: (state, action: PayloadAction<UpdateStepActivityPayload>) => {
      const {chatId, contentId, sequenceId, nextPlan} = action.payload
      const chat = state.find(chat => chat.id === chatId)
      if (!chat) {
        console.warn('no matching chat found when updating step')
        return
      }
      const content = chat.content.find(c => c.id === contentId)
      if (!content) {
        console.warn('no matching content found when updating step')
        return
      }
      content.apiCallPlan ??= {steps: []}
      const {apiCallPlan} = content
      const sequence = content.apiCallPlan?.steps[sequenceId]
      apiCallPlan.steps[sequenceId] ??= {
        id: v4(),
        step: nextPlan,
        progressStage: ProgressStage.active,
      }
      Object.assign(apiCallPlan.steps[sequenceId].step, action.payload.nextPlan)
    },
    setPlan: (state, action: PayloadAction<{plan: ApiCallPlan, chatId: string, contentId: string}>) => {
      const {plan, chatId, contentId} = action.payload
      const chat = state.find(chat => chat.id === chatId)
      if (!chat) {
        console.warn('no matching chat found when updating step')
        return
      }
      const content = chat.content.find(c => c.id === contentId)
      if (!content) {
        console.warn('no matching content found when updating step')
      }
      content!.apiCallPlan = plan
    }
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
  updateStep,
  setPlan
} = chatsSlice.actions


