// src/store/reducers/brushReducer.ts
import {TOGGLE_BRUSH, SET_LINE_WIDTH} from '../actions/brushActions';

const initialState = {
    isBrushActive: false,
    brushSize: 2,
};

const brushReducer = (state = initialState, action: {type: any; payload?: any;}) => {
    switch (action.type) {
        case TOGGLE_BRUSH:
            return {
                ...state,
                isBrushActive: !state.isBrushActive,
            };
        case SET_LINE_WIDTH:
            return {
                ...state,
                lineWidth: action.payload,
            };
        default:
            return state;
    }
};

export default brushReducer;
