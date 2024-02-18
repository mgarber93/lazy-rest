import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthoredContent, createContent} from '../../models/content';

export interface ChatMessages {
  messages: AuthoredContent[];
}

const initialState: ChatMessages = {
  messages: [createContent('type here...', '')],
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
    updateMessageEditableFlag: (state, action: PayloadAction<{ message: string; editable: boolean }>) => {
      const msg = state.messages.find(m => m.message === action.payload.message);
      if (msg) {
        msg.editable = action.payload.editable;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateResponse.fulfilled, (state, action) => {
      const content = createContent(action.payload,'chat-gpt-3', false)
      state.messages.push(content);
    });
  },
});

// Export actions to use dispatch in component
export const {updateMessageEditableFlag} = chatsSlice.actions;

export default chatsSlice.reducer;