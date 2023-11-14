// store/storeTypes.ts
export interface RootState {
    tool: any;
    brush: {
        isBrushActive: boolean;
        brushSize: number;
        brushColor: string;
    };
    context: any;
    eraserSize: number;
}