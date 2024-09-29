import {createSlice} from '@reduxjs/toolkit'
import {ApiConfiguration} from '../../models/api-configuration'
import {Approvable} from '../../models/approvable'
import {CallPlan} from '../../main/organizations/models'

export interface ToolState {
  approvable: Approvable | null
  api: Record<string, ApiConfiguration>
  plans: Record<string, CallPlan>
}

export const toolsSlice = createSlice({
  name: 'tools',
  initialState: {
    api: {},
  } as ToolState,
  reducers: {
    addApiConfiguration: (state, action) => {
      const {key, configuration} = action.payload
      state.api[key] = configuration
    },
  },
})

export const {addApiConfiguration} = toolsSlice.actions
