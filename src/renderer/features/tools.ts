import {createSlice} from '@reduxjs/toolkit';
import {ApiConfiguration} from '../../models/api-configuration';

const serializedTools = localStorage.getItem('tools')
const tools = JSON.parse(serializedTools) ?? {
  api: {},
} as { api: Record<string, ApiConfiguration> };


export const toolsSlice = createSlice({
  name: 'tools',
  initialState: tools as {api: Record<string, ApiConfiguration>},
  reducers: {
    addApiConfiguration: (state, action) => {
      const {key, configuration} = action.payload;
      state.api[key] = configuration;
    },
  },
});

export const {addApiConfiguration} = toolsSlice.actions
