// store/storeTypes.ts
import {BrushState} from '../slices/brushSlice';
import {EraserState} from '../slices/eraserSlice';
export interface RootState {
    brush: BrushState;
    eraser: EraserState;
}