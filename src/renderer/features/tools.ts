import {createSelector, createSlice} from '@reduxjs/toolkit'
import {ApiConfiguration} from '../../models/api-configuration'
import {RootState} from './store'

export interface ToolState {
  api: Record<string, ApiConfiguration>
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

export const selectAllApiConfigurations = createSelector(
  (state: RootState) => state.tools.api,
  (api) => Object.values(api),
)

export const {addApiConfiguration} = toolsSlice.actions
