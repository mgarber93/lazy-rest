import {MiddlewareAPI, UnknownAction} from '@reduxjs/toolkit'
import {Dispatch} from 'react'

export function readInitialState<T>(key: string, initialState: T): () => T {
  return () => {
    const serialized = localStorage.getItem(key)
    const state = JSON.parse(serialized) as T
    return state ?? initialState
  }
}

export const localStorageMiddleware = (store: MiddlewareAPI) => (next: Dispatch<UnknownAction>) => (action: UnknownAction) => {
  const result = next(action)
  const state = store.getState()
  const keys = Object.keys(state)
  localStorage.setItem("keys", JSON.stringify(keys))
  keys
    .filter(key => key !== 'keys')
    .forEach(key => {
      localStorage.setItem(key, JSON.stringify(state[key]))
    })
  
  return result
}
