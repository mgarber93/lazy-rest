import {EnhancedStore} from '@reduxjs/toolkit';
import {RootState} from './renderer/features/store';
import {appendDelta} from './renderer/features/chat';

export const connectCallbacks = (store: EnhancedStore) => {
  const handleMessageDelta = (electronEvent: any, authoredContentDelta: any) => {
    const {chatId, messageId, delta, closed} = authoredContentDelta;
    // if (closed) {
    //   window.main.remove('message-delta', handleMessageDelta);
    //   // live for the life of the window
    //   return
    // }
    store.dispatch(appendDelta({chatId, messageId, delta}));
  };
  window.main.receive('message-delta', handleMessageDelta);

  const handleLoadOas = (event: any, id: string) => {
    const state = store.getState() as RootState;
    const apis = state.tools.api as Record<string, any>;
    const responses = [];

    for (const key in apis) {
      if (!apis.hasOwnProperty(key)) {
        continue;
      }
      const serialized = localStorage.getItem(key)
      if (serialized === null) {
        console.warn(`oas: ${key} not found`);
        continue;
      }
      const oas = JSON.parse(serialized);
      responses.push(oas);
    }
    window.main.callback(id, responses);
  }
  window.main.receive('load-oas', handleLoadOas);
}