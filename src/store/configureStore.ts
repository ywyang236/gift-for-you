// src/store/configureStore.ts
import {configureStore} from '@reduxjs/toolkit';
import brushReducer from './slices/brushSlice';
import eraserReducer from './slices/eraserSlice';

const store = configureStore({
    reducer: {
        brush: brushReducer,
        eraser: eraserReducer,
    },
});

export default store;
