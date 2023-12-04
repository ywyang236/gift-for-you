// src/store/slices/dragSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';


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
        toggleDragActive(state) {
            state.isDragActive = !state.isDragActive;
        },
        setSelectedPathIndex(state, action: PayloadAction<number | null>) {
            state.selectedPathIndex = action.payload;
        },
    },
});

export const {toggleDragActive, setSelectedPathIndex} = dragSlice.actions;

export default dragSlice.reducer;
