// store/storeTypes.ts
export interface RootState {
    tool: any;
    brush: {
        isBrushActive: boolean;
        brushSize: number;
        brushColor: string;
    };
    eraser: {
        context: any;
        eraserSize: number;
        isEraserActive: boolean;
    };
}