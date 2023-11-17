// src/store/slices/brushSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface BrushState {
    isBrushActive: boolean;
    brushSize: number;
    brushColor: string;
}

const initialState: BrushState = {
    isBrushActive: false,
    brushSize: 6,
    brushColor: '#000000',
};

const brushSlice = createSlice({
    name: 'brush',
    initialState,
    reducers: {
        activateBrush(state) {
            state.isBrushActive = true;
            state.brushSize = 6;
            state.brushColor = '#000000';
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
