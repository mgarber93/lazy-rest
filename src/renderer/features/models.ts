import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

const name = 'models';

const initialState = {
  models: [] as string[]
}

export const listModels = createAsyncThunk(
  `${name}/listModels`,
  async () => {
    const models = await window.main.getModels();
    return models.split(',');
  }
)

export const modelsSlice = createSlice({
  name,
  initialState,
  reducers: {
    updateModels(state, action: PayloadAction<string[]>) {
      state.models = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(listModels.fulfilled, (state, action) => {
      state.models = action.payload;
    });
  }
})