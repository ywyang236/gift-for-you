// src/store/slices/brushSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface BrushState {
    isBrushActive: boolean;
    brushSize: number;
    brushColor: string | null;
}

const initialState: BrushState = {
    isBrushActive: false,
    brushSize: 6,
    brushColor: null,
};

const brushSlice = createSlice({
    name: 'brush',
    initialState,
    reducers: {
        activateBrush(state) {
            state.isBrushActive = true;
        },
        deactivateBrush(state) {
            state.isBrushActive = false;
        },
        setBrushSize(state, action: PayloadAction<number>) {
            state.brushSize = action.payload;
        },
        setBrushColor(state, action: PayloadAction<string>) {
            state.brushColor = action.payload;
        },
    },
});

export const {activateBrush, deactivateBrush, setBrushSize, setBrushColor} = brushSlice.actions;

export default brushSlice.reducer;
