import {createSlice, PayloadAction} from '@reduxjs/toolkit';


export const currentChatSlice = createSlice({
  name: 'currentChat',
  initialState: null as string | null,
  reducers: {
    selectChat: (state, action: PayloadAction<string>) => action.payload,
  },
});