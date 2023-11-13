import {TOGGLE_BRUSH} from '../actions/brushActions';

const initialState = {
    isBrushActive: false,
};

const brushReducer = (state = initialState, action: {type: any;}) => {
    switch (action.type) {
        case TOGGLE_BRUSH:
            return {
                ...state,
                isBrushActive: !state.isBrushActive,
            };
        default:
            return state;
    }
};

export default brushReducer;
