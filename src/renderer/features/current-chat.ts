import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('currentChat'));

export const currentChatSlice = createSlice({
  name: 'currentChat',
  initialState: initialState as string | null,
  reducers: {
    selectChat: (state, action: PayloadAction<string>) => action.payload,
  },
});


export const {selectChat} = currentChatSlice.actions;