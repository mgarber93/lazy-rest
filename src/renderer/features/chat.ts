import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthoredContent, createContent} from '../../models/content';

export interface ChatMessages {
  messages: AuthoredContent[];
}

function createResponse() {
  return createContent('', 'user', true);
}

const initialState: ChatMessages = {
  messages: [createResponse()],
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
      const index = state.messages.findIndex(m => m.id === id);
      if (index > -1) {
        state.messages[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateResponse.fulfilled, (state, action) => {
      const content = createContent(action.payload, 'chat-gpt-3', false)
      state.messages.push(content);
      state.messages.push(createResponse())
    });
  },
});

// Export actions to use dispatch in component
export const {respond} = chatsSlice.actions;

export default chatsSlice.reducer;