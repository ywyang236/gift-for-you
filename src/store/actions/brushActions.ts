// src/store/actions/brushActions.ts
export const TOGGLE_BRUSH = 'TOGGLE_BRUSH';

export const toggleBrush = () => ({
    type: TOGGLE_BRUSH,
});

export const SET_BRUSH_SIZE = 'SET_BRUSH_SIZE';

export const setBrushSize = (width: number) => ({
    type: SET_BRUSH_SIZE,
    payload: width,
});

export const SET_BRUSH_COLOR = 'SET_BRUSH_COLOR';

export const setBrushColor = (color: string) => ({
    type: SET_BRUSH_COLOR,
    payload: color,
});