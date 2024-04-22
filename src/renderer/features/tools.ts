import {createSlice} from '@reduxjs/toolkit';

export interface ApiConfiguration {
  fileHandle: string;
  name: string;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
}

const serializedTools = localStorage.getItem('tools')
const tools = JSON.parse(serializedTools) ?? {
  api: {},
} as { api: Record<string, ApiConfiguration> };


export const toolsSlice = createSlice({
  name: 'tools',
  initialState: tools,
  reducers: {
    addApiConfiguration: (state, action) => {
      const {key, configuration} = action.payload;
      state.api[key] = configuration;
    },
  },
});

export const {addApiConfiguration} = toolsSlice.actions
