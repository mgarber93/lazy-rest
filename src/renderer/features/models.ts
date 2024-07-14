import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {OpenAiConfiguration} from '../../models/provider-config'

const name = 'models'

const initialState = {
  models: [] as string[],
  providers: {
    openAi: null as OpenAiConfiguration | null,
    anthropic: null as object | null,
  },
  organizations: [""],
}


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
