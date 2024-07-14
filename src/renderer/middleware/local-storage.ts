import {MiddlewareAPI, UnknownAction} from '@reduxjs/toolkit'
import {Dispatch} from 'react'

export function readInitialState<T>(key: string, initialState: T): () => T {
  return () => {
    const serialized = localStorage.getItem(key)
    const state = JSON.parse(serialized) as T
    return state ?? initialState
  }
}

export function loadState<T>(): T {
  const keysSerialized = localStorage.getItem('keys')
  const keys = JSON.parse(keysSerialized) ?? []
  return keys
    .reduce(
      (acc: Partial<T>, key: keyof T) => {
        const serialized = localStorage.getItem(key as string)
        acc[key] = JSON.parse(serialized)
        return acc
      },
      {} as Partial<T>,
    )
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
