// src/store/reducers/index.ts
import {combineReducers} from 'redux';
import brushReducer from './brushReducer';

const rootReducer = combineReducers({
    brush: brushReducer,
});

export default rootReducer;
