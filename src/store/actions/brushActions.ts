// src/store/actions/brushActions.ts
export const TOGGLE_BRUSH = 'TOGGLE_BRUSH';

export const toggleBrush = () => ({
    type: TOGGLE_BRUSH,
});

export const SET_LINE_WIDTH = 'SET_LINE_WIDTH';

export const setLineWidth = (width: number) => ({
    type: SET_LINE_WIDTH,
    payload: width,
});