// store/storeTypes.ts
import {BrushState} from '../slices/brushSlice';
import {EraserState} from '../slices/eraserSlice';
import {UserState} from '../slices/userSlice';
import {DragState} from '../slices/dragSlice';
export interface RootState {
    brush: BrushState;
    eraser: EraserState;
    user: UserState;
    drag: DragState;
}