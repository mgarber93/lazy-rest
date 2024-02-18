
import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import {chatsSlice} from './features/chat';

import { useDispatch } from 'react-redux'

export const store = configureStore({
  reducer: {
    chats: chatsSlice.reducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const useAppDispatch = () => useDispatch<AppDispatch>() // explicitly defining the type of dispatch here