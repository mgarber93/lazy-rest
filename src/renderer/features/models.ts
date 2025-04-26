import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {TModel} from '../../models/responder'
import {ClientOptions} from 'openai'

const name = 'models'

const initialState = {
  models: [] as TModel[],
  ollamaModels: [] as string[],
  bedrockModels: [] as string[],
  providers: {
    openAi: null as ClientOptions | null,
    ollama: null as object | null,
    bedrock: null as {
      region: string;
      credentials: {
        accessKeyId: string;
        secretAccessKey: string;
      };
    } | null,
  },
  organizations: [""],
}


export const listOpenAiModels = createAsyncThunk(
  `${name}/listModels`,
  async () => {
    const models = await window.main.getModels('openai')
    return models
  },
)

export const listOllamaModels = createAsyncThunk(
  `${name}/listOllamaModels`,
  async () => {
    const models = await window.main.getModels('ollama')
    return models
  },
)

export const listBedrockModels = createAsyncThunk(
  `${name}/listBedrockModels`,
  async () => {
    const models = await window.main.getModels('bedrock')
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
    configureBedrock(state, action: PayloadAction<{
      region: string;
      credentials: {
        accessKeyId: string;
        secretAccessKey: string;
      };
    }>) {
      state.providers.bedrock = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listOpenAiModels.fulfilled, (state, action) => {
      state.models = action.payload as TModel[]
    })
    builder.addCase(listOllamaModels.fulfilled, (state, action) => {
      state.ollamaModels = action.payload as TModel[]
    })
    builder.addCase(listBedrockModels.fulfilled, (state, action) => {
      state.bedrockModels = action.payload as string[]
    })
  },
})


export const {configureOpenAi, configureBedrock} = modelsSlice.actions
