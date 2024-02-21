import { TypedUseSelectorHook, useSelector } from 'react-redux';
import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import {useDispatch} from 'react-redux'
import {chatsSlice, localStorageMiddleware} from './features/chat';
import {userSlice} from './features/user';
import {currentChatSlice} from './features/current-chat';

export const store = configureStore({
  reducer: {
    chats: chatsSlice.reducer,
    user: userSlice.reducer,
    currentChat: currentChatSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;