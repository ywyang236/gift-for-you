// src/store/reducers/eraserReducer.ts
import {ACTIVATE_ERASER, SET_ERASER_SIZE} from '../actions/eraserActions';

const initialState = {
    isEraserActive: false,
    eraserSize: 6,
};

const eraserReducer = (state = initialState, action: {type: any; payload?: any;}) => {
    switch (action.type) {
        case ACTIVATE_ERASER:
            return {
                ...state,
                isEraserActive: true,
            };
        case SET_ERASER_SIZE:
            return {
                ...state,
                eraserSize: action.payload,
            };
        default:
            return state;
    }
}

export default eraserReducer;