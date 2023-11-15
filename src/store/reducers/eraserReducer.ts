// src/store/reducers/eraserReducer.ts
import {ACTIVATE_ERASER} from '../actions/eraserActions';

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
        default:
            return state;
    }
}

export default eraserReducer;