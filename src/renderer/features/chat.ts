import {
  createAsyncThunk,
  createSlice,
  MiddlewareAPI,
  PayloadAction,
  UnknownAction,
} from '@reduxjs/toolkit';
import {AuthoredContent, createContent} from '../../models/content';
import {Conversation} from '../../models/conversation';
import {Dispatch} from 'react';
import {v4} from 'uuid'


const serializedChats = localStorage.getItem('chats')
const chats = JSON.parse(serializedChats)

const initialState: Conversation = chats ?? {
  id: v4(),
  content: [],
};

const name = 'chats';

export const generateResponse = createAsyncThunk(
  `${name}/generateResponse`,
  async (message: AuthoredContent) => {
    return await window.main.chat(message.message);
  },
);

export const chatsSlice = createSlice({
  name,
  initialState,
  reducers: {
    respond: (state, action: PayloadAction<AuthoredContent>) => {
      const {id} = action.payload;
      const index = state.content.findIndex(m => m.id === id);
      if (index > -1) {
        state.content[index] = action.payload;
      } else {
        state.content.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateResponse.fulfilled, (state, action) => {
      const content = createContent(action.payload, 'chat-gpt-3', false)
      state.content.push(content);
    });
  },
});

// Export actions to use dispatch in component
export const {respond} = chatsSlice.actions;

export const localStorageMiddleware = (store: MiddlewareAPI) => (next: Dispatch<UnknownAction>) => (action: UnknownAction) => {
  const result = next(action);
  localStorage.setItem(name, JSON.stringify(store.getState().chats));
  return result;
};