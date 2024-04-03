import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthoredContent, ContentDelta} from '../../models/content';
import {Conversation, createConversation} from '../../models/conversation';
import {TAutoPrompter} from '../../models/auto-prompter';
import {Responder} from '../../models/responder';


const serializedChats = localStorage.getItem('chats')
const chats = JSON.parse(serializedChats)
const initialState: Conversation[] = chats ?? [createConversation()];
const name = 'chats';

export const streamResponse = createAsyncThunk(
  `${name}/streamResponse`,
  async (arg: { conversationId: string, contentId: string }, thunkAPI) => {
    const {conversationId, contentId} = arg;
    const state = thunkAPI.getState() as { chats: Conversation[] };
    const conversation = state.chats.find(chat => chat.id === conversationId);
    // Cant respond unless a responder is set and an auto prompter isn't
    if (!conversation || !conversation.responder)
      return null;
    
    const response = conversation.content.find(content => content.id === contentId)
    if (!response)
      return null
    
    const channel = 'message-delta';
    const callBack = (electronEvent: any, authoredContentDelta: any) => {
      const {chatId, messageId, delta, closed} = authoredContentDelta;
      if (closed) {
        window.main.remove(channel, callBack);
        return
      }
      thunkAPI.dispatch(appendDelta({chatId, messageId, delta}));
    };
    window.main.receive(channel, callBack);
    await window.main.streamedChat(conversation, response.id);
  },
)


export const chatsSlice = createSlice({
  name,
  initialState,
  reducers: {
    respond: (state, action: PayloadAction<AuthoredContent>) => {
      const {id, chatId} = action.payload;
      if (!id)
        throw new Error('no id')
      const conversation = state.find(conversation => conversation.id === chatId);
      if (!conversation) {
        return state;
      }
      const contentIndex = conversation.content.findIndex(m => m.id === id);
      if (contentIndex > -1) {
        conversation.content[contentIndex] = action.payload;
      } else {
        conversation.content.push(action.payload);
      }
      return state;
    },
    appendDelta: (state, action: PayloadAction<ContentDelta>) => {
      const {chatId, messageId, delta} = action.payload;
      const conversation = state.find(conversation => conversation.id === chatId);
      if (!conversation) {
        return state;
      }
      const chat = conversation.content.find(content => content.id === messageId);
      if (!chat) {
        return state;
      }
      chat.message += delta;
      return state;
    },
    startNewChat: (state, action: PayloadAction<Conversation | null>) => {
      if (action.payload) {
        action.payload.created = Date()
        state.push(action.payload);
      } else {
        const newChat: Conversation = createConversation();
        state.push(newChat);
      }
    },
    updateTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
      const chat = state.find(chat => chat.id === action.payload.id);
      if (action.payload.title) {
        chat.title = action.payload.title.slice(0, 14);
      } else {
        const index = state.findIndex(chat => chat.id === action.payload.id);
        chat.title = 'chat' + index;
      }
    },
    removeChat: (state, action: PayloadAction<string>) => {
      return state.filter(chat => chat.id !== action.payload);
    },
    selectModelChat: (state, action: PayloadAction<{ chat: string, model: Responder }>) => {
      const {chat, model} = action.payload;
      const conversationIndex = state.findIndex(conversation => conversation.id === chat);
      if (conversationIndex === -1) {
        return state;
      }
      state[conversationIndex].responder = model;
    },
    selectAutoPrompter: (state, action: PayloadAction<{ chatId: string, model: TAutoPrompter }>) => {
      const {chatId} = action.payload;
      const chat = state.find(chat => chat.id === chatId);
    },
    removeAutoPrompter: (state, action: PayloadAction<{ chatId: string }>) => {
      const {chatId} = action.payload;
      const chat = state.find(chat => chat.id === chatId);
    },
    setResponder: (state, action: PayloadAction<{responder: Responder, chatId: string}>) => {
      const {chatId, responder} = action.payload;
      const foundChat = state.find(chat => chat.id === chatId);
      if (!foundChat) {
        console.error('no matching chat found when setting responder')
      }
      foundChat.responder = responder;
    },
  },
  extraReducers: (builder) => {
  },
});

// Export actions to use dispatch in component
export const {
  respond,
  startNewChat,
  removeChat,
  selectModelChat,
  updateTitle,
  selectAutoPrompter,
  removeAutoPrompter,
  appendDelta,
  setResponder,
} = chatsSlice.actions;


