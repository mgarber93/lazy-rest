import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {User} from '../../models/user'

export const getMachineName = createAsyncThunk(
  'user/getMachineName',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { user: User | null }
    if (state.user?.username) {
      return state.user.username
    } else {
      return await window.main.getMachineName()
    }
  },
)

export const userSlice = createSlice({
  name: 'user',
  initialState: null as User | null,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMachineName.fulfilled, (state, action) => {
      if (!state.username)
        state = {username: action.payload}
      localStorage.setItem('user', JSON.stringify(state))
      return state
    })
  },
})

export const {} = userSlice.actions
