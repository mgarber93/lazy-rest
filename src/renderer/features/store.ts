import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import {chatsSlice} from './chat';
import {userSlice} from './user';
import {currentChatSlice} from './current-chat';
import {contextMenuSlice} from './context-menu';
import {modelsSlice} from './models';
import {localStorageMiddleware} from '../middleware/local-storage';


export const store = configureStore({
  reducer: {
    chats: chatsSlice.reducer,
    user: userSlice.reducer,
    currentChat: currentChatSlice.reducer,
    contextMenu: contextMenuSlice.reducer,
    models: modelsSlice.reducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;