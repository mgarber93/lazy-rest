import {createSlice, PayloadAction} from '@reduxjs/toolkit'


export const currentChatSlice = createSlice({
  name: 'currentChat',
  initialState: '',
  reducers: {
    selectChat: (state, action: PayloadAction<string>) => state = action.payload,
  },
})


export const {selectChat} = currentChatSlice.actions
