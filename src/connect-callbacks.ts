import {EnhancedStore} from '@reduxjs/toolkit';
import {RootState} from './renderer/features/store';
import {appendDelta} from './renderer/features/chat';
import {Approval, ApprovedResponse} from './models/approval';

/**
 * Is this a middleware?
 * Is this a view Provider thingy like react redux's provider component
 * @param store
 */
export const connectCallbacks = (store: EnhancedStore) => {
  const handleMessageDelta = (electronEvent: any, authoredContentDelta: any) => {
    const {chatId, messageId, delta, closed} = authoredContentDelta;
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

  const handleApproval = (event: any, id: string, approvalRequest: Approval) => {
    // @todo do something based on user input with the request object. Clearing requests can vary so theres some
    // switching to do here
    const state = store.getState() as RootState;

    const keys = Object.keys(state.tools.api)
    if (keys.length === 0) {
      alert('no key set');
      throw Error('');
    }

    const firstApi = state.tools.api[keys[0]];

    window.main.callback(id, {
      response: "approve",
      clientId: firstApi.clientId,
      clientSecret: firstApi.clientSecret,
    } as ApprovedResponse);
    // @todo prompt user with serialized plan or print to window, and toast a yes, no ?
  }
  window.main.receive('approval', handleApproval);
}