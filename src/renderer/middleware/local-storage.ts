import {MiddlewareAPI, UnknownAction} from '@reduxjs/toolkit';
import {Dispatch} from 'react';

export const localStorageMiddleware = (store: MiddlewareAPI) => (next: Dispatch<UnknownAction>) => (action: UnknownAction) => {
  const result = next(action);
  localStorage.setItem('user', JSON.stringify(store.getState().user));
  localStorage.setItem('chats', JSON.stringify(store.getState().chats));
  localStorage.setItem('currentChat', JSON.stringify(store.getState().currentChat));
  return result;
};