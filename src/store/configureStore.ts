// src/store/configureStore.ts
import {configureStore} from '@reduxjs/toolkit';
import rootReducer from '../store/reducers/index';

const store = configureStore({
    reducer: rootReducer,
});

export default store;
