import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TModel } from "../../models/responder"
import { ClientOptions } from "openai"

const name = "models"

const initialState = {
  models: [] as TModel[],
  ollamaModels: [] as string[],
  providers: {
    openAi: null as ClientOptions | null,
    anthropic: null as object | null,
    ollama: null as object | null,
  },
  organizations: [""],
}

export const listOpenAiModels = createAsyncThunk(
  `${name}/listModels`,
  async () => {
    const models = await window.main.getModels("openai")
    return models
  },
)

export const listOllamaModels = createAsyncThunk(
  `${name}/listOllamaModels`,
  async () => {
    const models = await window.main.getModels("ollama")
    return models
  },
)

export const modelsSlice = createSlice({
  name,
  initialState,
  reducers: {
    configureOpenAi(state, action: PayloadAction<ClientOptions>) {
      state.providers.openAi = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listOpenAiModels.fulfilled, (state, action) => {
      state.models = action.payload as TModel[]
    })
    builder.addCase(listOllamaModels.fulfilled, (state, action) => {
      state.ollamaModels = action.payload as TModel[]
    })
  },
})

export const { configureOpenAi } = modelsSlice.actions
