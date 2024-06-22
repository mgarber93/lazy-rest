import {createSlice} from '@reduxjs/toolkit'
import {ApiConfiguration} from '../../models/api-configuration'
import {CallPlan} from '../../models/conversation'


export interface ToolState {
  api: Record<string, ApiConfiguration>
  plans: Record<string, CallPlan>
}

const serializedTools = localStorage.getItem('tools')
const tools = JSON.parse(serializedTools) ?? {
  api: {},
} as ToolState


export const toolsSlice = createSlice({
  name: 'tools',
  initialState: tools as ToolState,
  reducers: {
    addApiConfiguration: (state, action) => {
      const {key, configuration} = action.payload
      state.api[key] = configuration
    },
  },
})

export const {addApiConfiguration} = toolsSlice.actions
