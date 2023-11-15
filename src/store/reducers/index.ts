// src/store/reducers/index.ts
import {combineReducers} from 'redux';
import brushReducer from './brushReducer';
import eraserReducer from './eraserReducer';

const rootReducer = combineReducers({
    brush: brushReducer,
    eraser: eraserReducer,
});

export default rootReducer;
