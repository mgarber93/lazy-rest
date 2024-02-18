import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Message} from '../models/message';

export interface ChatMessages {
  messages: Message[];
}

const initialState: ChatMessages = {
  messages: [{message: 'Type here to begin', editable: true, author: 'this'}],
};

const name = 'chats';

export const generateResponse = createAsyncThunk(
  `${name}/generateResponse`,
  async (message: Message) => {
    message.editable = false;
    return await window.openai.chat(message.message);
  },
);

export const chatsSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(generateResponse.fulfilled, (state, action) => {
      state.messages.push({message: action.payload, author: 'chat-gpt-3', editable: false});
    });
  },
});

// Export actions to use dispatch in component
// export const {} = chatsSlice.actions;

export default chatsSlice.reducer;