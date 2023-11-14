// src/store/reducers/brushReducer.ts
import {TOGGLE_BRUSH, SET_BRUSH_SIZE, SET_BRUSH_COLOR} from '../actions/brushActions';

const initialState = {
    isBrushActive: false,
    brushSize: 6,
    brushColor: '#000000',
};

const brushReducer = (state = initialState, action: {type: any; payload?: any;}) => {
    switch (action.type) {
        case TOGGLE_BRUSH:
            return {
                ...state,
                isBrushActive: !state.isBrushActive,
            };
        case SET_BRUSH_SIZE:
            return {
                ...state,
                brushSize: action.payload,
            };
        case SET_BRUSH_COLOR:
            return {
                ...state,
                brushColor: action.payload,
            };
        default:
            return state;
    }
};

export default brushReducer;
