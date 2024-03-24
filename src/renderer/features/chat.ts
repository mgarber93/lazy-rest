import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {v4} from 'uuid'
import {AsyncThunkConfig, GetThunkAPI} from '@reduxjs/toolkit/dist/createAsyncThunk';
import {AuthoredContent, ContentDelta, createContent, Role} from '../../models/content';
import {Conversation, createConversation} from '../../models/conversation';
import {TAutoPrompter} from '../../models/auto-prompter';


const serializedChats = localStorage.getItem('chats')
const chats = JSON.parse(serializedChats)

const initialState: Conversation[] = chats ?? [createConversation()];

const name = 'chats';

export const generateResponse = createAsyncThunk(
  `${name}/generateResponse`,
  async (conversationId: string, thunkAPI) => {
    const state = thunkAPI.getState() as { chats: Conversation[] };
    const conversation = state.chats.find(chat => chat.id === conversationId);
    // Cant respond unless a responder is set and an auto prompter isn't
    if (!conversation || !conversation.responder || conversation.autoPrompter) {
      return null;
    }
    const responseMessage = await window.main.chat(conversation);
    return {
      role: responseMessage.role,
      content: responseMessage.content,
      chatId: conversation.id,
      model: conversation.responder,
    };
  },
);

export const streamResponse = createAsyncThunk(
  `${name}/streamResponse`,
  async (arg: { conversationId: string, contentId: string }, thunkAPI) => {
    const {conversationId, contentId} = arg;
    const state = thunkAPI.getState() as { chats: Conversation[] };
    const conversation = state.chats.find(chat => chat.id === conversationId);
    // Cant respond unless a responder is set and an auto prompter isn't
    if (!conversation || !conversation.responder || conversation.autoPrompter)
      return null;
    
    const response = conversation.content.find(content => content.id === contentId)
    if (!response)
      return null
    
    const callBack = (electronEvent: any, authoredContentDelta: any) => {
      const {chatId, messageId, delta} = authoredContentDelta;
      thunkAPI.dispatch(appendDelta({chatId, messageId, delta}));
    };
    console.log('subscribing')
    const channel = 'message-delta';
    window.main.receive(channel, callBack);
    await window.main.streamedChat(conversation, response.id);
    console.log('removing')
    window.main.remove(channel, callBack);
  },
)

export const autoPrompt = createAsyncThunk(
  `${name}/autoPrompt`,
  async (arg: { conversationId: string }, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    const state = thunkAPI.getState() as { chats: Conversation[] };
    const {conversationId} = arg;
    const conversation = state.chats.find(chat => chat.id === conversationId);
    if (!conversation || !conversation.autoPrompter) {
      return null;
    }
    const callBack = () => {
    }
    
    window.main.receive('tool-request', callBack);
    switch (conversation.autoPrompter) {
      case "execute plan": {
        throw new Error('Not implemented');
      }
    }
    
    window.main.remove('tool-request', callBack)
    const serializedResponse = await window.main.apiAutoPrompt(conversation)
    const responseMessage = serializedResponse;
    return {
      role: responseMessage.role,
      content: responseMessage.content,
      chatId: conversation.id,
      model: conversation.responder,
    };
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
    startNewChat: (state, action: PayloadAction) => {
      const newChat: Conversation = createConversation();
      state.push(newChat);
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
    selectModelChat: (state, action: PayloadAction<{ chat: string, model: string }>) => {
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
      chat.autoPrompter = action.payload.model;
    },
    removeAutoPrompter: (state, action: PayloadAction<{ chatId: string }>) => {
      const {chatId} = action.payload;
      const chat = state.find(chat => chat.id === chatId);
      chat.autoPrompter = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateResponse.fulfilled, (state, action) => {
      const {role, content, chatId, model} = action.payload;
      const authoredContent = createContent(content, chatId, model, role as Role)
      const conversation = state.find(conversation => conversation.id === chatId);
      if (!conversation) {
        return state;
      }
      conversation.content.push(authoredContent);
    });
    builder.addCase(autoPrompt.fulfilled, (state, action) => {
      const {role, content, chatId, model} = action.payload;
      const authoredContent = createContent(content, chatId, model, role as Role)
      const conversationIndex = state.findIndex(conversation => conversation.id === chatId);
      if (conversationIndex === -1) {
        return state;
      }
      state[conversationIndex].content.push(authoredContent);
      state[conversationIndex].autoPrompter = undefined;
    });
  },
});

// Export actions to use dispatch in component
export const {
  respond,
  startNewChat,
  selectModelChat,
  updateTitle,
  selectAutoPrompter,
  removeAutoPrompter,
  appendDelta,
} = chatsSlice.actions;


