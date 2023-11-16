// src/store/configureStore.ts
import {configureStore} from '@reduxjs/toolkit';
import brushReducer from './slices/brushSlice';

const store = configureStore({
    reducer: {
        brush: brushReducer,
    },
});

export default store;
