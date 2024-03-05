import {ActionReducerMapBuilder, createSlice, PayloadAction} from '@reduxjs/toolkit';

type ContextMenuState = {
  visible: boolean;
  x: number;
  y: number;
  items: Array<string>;
};

const initialState: ContextMenuState = {
  visible: false,
  x: 0,
  y: 0,
  items: []
};

export const contextMenuSlice = createSlice({
  name: 'contextMenu',
  initialState,
  reducers: {
    updateContextMenu: (state, action: PayloadAction<ContextMenuState>) => {
      state.visible = action.payload.visible;
      state.x = action.payload.x;
      state.y = action.payload.y;
      state.items = action.payload.items;
    }
  },
  extraReducers<State>(builder: ActionReducerMapBuilder<State>): void {
  }
});

export const {updateContextMenu} = contextMenuSlice.actions;
