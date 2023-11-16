// store/storeTypes.ts
import {BrushState} from '../slices/brushSlice';

export interface RootState {
    brush: BrushState;
}