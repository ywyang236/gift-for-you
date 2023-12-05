// src/store/slices/dragSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {activateDrag, deactivateDrag, activateBrush, activateEraser} from '../sharedActions';

export interface DragState {
    isDragActive: boolean;
    selectedPathIndex: number | null;
}

const initialState: DragState = {
    isDragActive: false,
    selectedPathIndex: null,
};

const dragSlice = createSlice({
    name: 'drag',
    initialState,
    reducers: {
        activateDrag(state) {
            state.isDragActive = true;
            state.selectedPathIndex = null;
        },
        deactivateDrag(state) {
            state.isDragActive = false;
            state.selectedPathIndex = null;
        },
        setSelectedPathIndex(state, action: PayloadAction<number | null>) {
            state.selectedPathIndex = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(activateDrag, (state) => {
                state.isDragActive = true;
            })
            .addCase(deactivateDrag, (state) => {
                state.isDragActive = false;
            })
            .addCase(activateBrush, (state) => {
                state.isDragActive = false;
            })
            .addCase(activateEraser, (state) => {
                state.isDragActive = false;
            });
    }
});

export const {setSelectedPathIndex} = dragSlice.actions;

export default dragSlice.reducer;
