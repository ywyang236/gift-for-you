// src/store/slices/brushSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {activateBrush, deactivateBrush, activateEraser, activateDrag} from '../sharedActions';

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
        },
        deactivateBrush(state) {
            state.isBrushActive = false;
        },
        setBrushSize(state, action: PayloadAction<number>) {
            if (state.isBrushActive) {
                state.brushSize = action.payload;
            }
            state.isBrushActive = true;
            state.brushSize = action.payload;
        },
        setBrushColor(state, action: PayloadAction<string>) {
            if (state.isBrushActive) {
                state.brushColor = action.payload;
            }
            state.isBrushActive = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(activateBrush, (state) => {
                state.isBrushActive = true;
            })
            .addCase(deactivateBrush, (state) => {
                state.isBrushActive = false;
            })
            .addCase(activateEraser, (state) => {
                state.isBrushActive = false;
            })
            .addCase(activateDrag, (state) => {
                state.isBrushActive = false;
            });
    },
});

export const {setBrushSize, setBrushColor} = brushSlice.actions;

export default brushSlice.reducer;
