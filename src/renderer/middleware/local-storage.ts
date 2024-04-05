import {MiddlewareAPI, UnknownAction} from '@reduxjs/toolkit';
import {Dispatch} from 'react';

export const localStorageMiddleware = (store: MiddlewareAPI) => (next: Dispatch<UnknownAction>) => (action: UnknownAction) => {
  const result = next(action);
  const {user, chats, currentChat, models} = store.getState();
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('chats', JSON.stringify(chats))
  localStorage.setItem('currentChat', JSON.stringify(currentChat));
  localStorage.setItem('models', JSON.stringify(models));
  return result;
};