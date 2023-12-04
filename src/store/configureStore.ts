// src/store/configureStore.ts
import {configureStore} from '@reduxjs/toolkit';
import brushReducer from './slices/brushSlice';
import eraserReducer from './slices/eraserSlice';
import userReducer from './slices/userSlice';
import dragReducer from './slices/dragSlice';

const store = configureStore({
    reducer: {
        brush: brushReducer,
        eraser: eraserReducer,
        user: userReducer,
        drag: dragReducer,
    },
});

export default store;
