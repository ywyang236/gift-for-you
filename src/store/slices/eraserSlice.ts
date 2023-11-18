// src/store/slices/eraserSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {activateEraser, deactivateEraser, activateBrush} from '../sharedActions';

export interface EraserState {
    isEraserActive: boolean;
    eraserSize: number;
}

const initialState: EraserState = {
    isEraserActive: false,
    eraserSize: 6,
};

const eraserSlice = createSlice({
    name: 'eraser',
    initialState,
    reducers: {
        activateEraser(state) {
            state.isEraserActive = true;
            state.eraserSize = 6;
        },
        deactivateEraser(state) {
            state.isEraserActive = false;
        },
        setEraserSize(state, action: PayloadAction<number>) {
            state.eraserSize = action.payload;
            state.isEraserActive = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(activateEraser, (state) => {
                state.isEraserActive = true;
            })
            .addCase(deactivateEraser, (state) => {
                state.isEraserActive = false;
            })
            .addCase(activateBrush, (state) => {
                state.isEraserActive = false;
            });
    },
});

export const {setEraserSize} = eraserSlice.actions;

export default eraserSlice.reducer;

