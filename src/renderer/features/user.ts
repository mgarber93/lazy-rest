import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {User} from '../../models/user';

const serializedChats = localStorage.getItem('user')
const user = JSON.parse(serializedChats) ?? {};

export const getMachineName = createAsyncThunk(
  'user/getMachineName',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { user: User | null };
    if (state.user.username) {
      return state.user.username;
    } else {
      return await window.main.getMachineName();
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: user as User | null,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getMachineName.fulfilled, (state, action) => {
      if (!state.username)
        state = {username: action.payload}
      localStorage.setItem('user', JSON.stringify(state));
      return state;
    });
  },
});

export const {} = userSlice.actions;
