import {createAsyncThunk, createSlice, MiddlewareAPI, PayloadAction, UnknownAction} from '@reduxjs/toolkit';
import {AuthoredContent, createContent} from '../../models/content';
import {Conversation} from '../../models/conversation';
import {Dispatch} from 'react';
import {v4} from 'uuid'


const serializedChats = localStorage.getItem('chats')
const chats = JSON.parse(serializedChats)

const initialState: Conversation[] = chats ?? [{
  id: v4(),
  content: [],
  title: 'New Chat',
} as Conversation];

const name = 'chats';

export const generateResponse = createAsyncThunk(
  `${name}/generateResponse`,
  async ({content, model}: { content: AuthoredContent, model: string }) => {
    const {message, chatId} = content;
    const serializedResponse = await window.main.chat(JSON.stringify({message, model}));
    const responseMessage = JSON.parse(serializedResponse);
    return {
      role: responseMessage.role,
      content: responseMessage.content,
      chatId,
      model,
    };
  },
);

export const chatsSlice = createSlice({
  name,
  initialState,
  reducers: {
    respond: (state, action: PayloadAction<AuthoredContent>) => {
      const {id, chatId} = action.payload;
      const conversationIndex = state.findIndex(conversation => conversation.id === chatId);
      if (conversationIndex === -1) {
        return state;
      }
      const contentIndex = state[conversationIndex].content.findIndex(m => m.id === id);
      if (contentIndex > -1) {
        state[conversationIndex].content[contentIndex] = action.payload;
      } else {
        state[conversationIndex].content.push(action.payload);
      }
      return state;
    },
    startNewChat: (state, action: PayloadAction) => {
      const newChat: Conversation = {
        id: v4(),
        content: [],
        title: 'New Chat',
      };
      state.push(newChat);
    },
    removeChat: (state, action: PayloadAction<string>) => {
      return state.filter(chat => chat.id !== action.payload);
    },
    selectModelChat: (state, action: PayloadAction<{ chat: string, model: string }>) => {
      const {chat, model} = action.payload;
      const conversationIndex = state.findIndex(conversation => conversation.id === chat);
      if (conversationIndex === -1) {
        return state;
      }
      state[conversationIndex].responder = model;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateResponse.fulfilled, (state, action) => {
      const {role, content, chatId, model} = action.payload;
      const authoredContent = createContent(content, chatId, model, role)
      const conversationIndex = state.findIndex(conversation => conversation.id === chatId);
      if (conversationIndex === -1) {
        return state;
      }
      state[conversationIndex].content.push(authoredContent);
    });
  },
});

// Export actions to use dispatch in component
export const {respond, startNewChat, selectModelChat} = chatsSlice.actions;

export const localStorageMiddleware = (store: MiddlewareAPI) => (next: Dispatch<UnknownAction>) => (action: UnknownAction) => {
  const result = next(action);
  localStorage.setItem(name, JSON.stringify(store.getState().chats));
  return result;
};