import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit"
import { chatsSlice } from "./chat"
import { userSlice } from "./user"
import { modelsSlice } from "./models"
import { loadState, localStorageMiddleware } from "../middleware/local-storage"
import { toolsSlice } from "./tools"

const preloadedState = loadState()

export function createStore() {
  return configureStore({
    reducer: {
      chats: chatsSlice.reducer,
      user: userSlice.reducer,
      models: modelsSlice.reducer,
      tools: toolsSlice.reducer,
    },
    preloadedState,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(localStorageMiddleware),
  })
}
export const store = createStore()

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
