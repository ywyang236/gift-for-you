// src/store/configureStore.ts
import {configureStore} from '@reduxjs/toolkit';
import brushReducer from './slices/brushSlice';
import eraserReducer from './slices/eraserSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
    reducer: {
        brush: brushReducer,
        eraser: eraserReducer,
        user: userReducer,
    },
});

export default store;
