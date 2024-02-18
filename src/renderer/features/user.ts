import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../models/user';

const serializedChats = localStorage.getItem('user')
const user = JSON.parse(serializedChats)

export const getMachineNameThunk = createAsyncThunk(
  `${name}/getMachineName`,
  async () => {
    return await window.main.getMachineName();
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: null as User | null,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMachineNameThunk.fulfilled, (state, action) => {
      if (!state)
        state = {username: action.payload}
    });
  },
});

export const {login} = userSlice.actions;
