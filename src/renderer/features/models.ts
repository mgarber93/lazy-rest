import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {OpenAiConfiguration} from '../../models/provider-config'

const name = 'models'

const defaultState = {
  models: [] as string[],
  providers: {
    openAi: null as OpenAiConfiguration,
    anthropic: null as object,
  },
  organizations: [""],
}

const serializedModels = localStorage.getItem('models')
const deserializedState = JSON.parse(serializedModels)
const initialState = deserializedState ?? defaultState

export const listModels = createAsyncThunk(
  `${name}/listModels`,
  async () => {
    const models = await window.main.getModels('openai')
    return models.split(',')
  },
)

export const modelsSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateModels(state, action: PayloadAction<string[]>) {
      state.models = action.payload
    },
    configureOpenAi(state, action: PayloadAction<OpenAiConfiguration>) {
      state.providers.openAi = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listModels.fulfilled, (state, action) => {
      state.models = action.payload
    })
  },
})


export const {configureOpenAi} = modelsSlice.actions