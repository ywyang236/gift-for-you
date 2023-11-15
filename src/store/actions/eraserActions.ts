// src/store/actions/eraserActions.ts
export const ACTIVATE_ERASER = 'ACTIVATE_ERASER';

export const activateEraser = () => ({
    type: ACTIVATE_ERASER,
});

export const SET_ERASER_SIZE = 'SET_ERASER_SIZE';

export const setEraserSize = (width: number) => ({
    type: SET_ERASER_SIZE,
    payload: width,
});
