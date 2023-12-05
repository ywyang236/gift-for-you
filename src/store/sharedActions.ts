// src/store/sharedActions.ts
import {createAction} from '@reduxjs/toolkit';

export const activateBrush = createAction('shared/activateBrush');
export const deactivateBrush = createAction('shared/deactivateBrush');
export const activateEraser = createAction('shared/activateEraser');
export const deactivateEraser = createAction('shared/deactivateEraser');
export const activateDrag = createAction('shared/activateDrag');
export const deactivateDrag = createAction('shared/deactivateDrag');
