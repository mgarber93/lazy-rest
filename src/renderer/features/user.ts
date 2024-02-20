import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../models/user';

const serializedChats = localStorage.getItem('user')
const user = JSON.parse(serializedChats)

export const getMachineName = createAsyncThunk(
  'user/getMachineName',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { user: User | null };
    if (state.user) {
      return state.user.username;
    } else {
      return await window.main.getMachineName();
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: null as User | null,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(getMachineName.fulfilled, (state, action) => {
      if (!state)
        state = {username: action.payload}
      return state;
    });
  },
});

export const {} = userSlice.actions;
