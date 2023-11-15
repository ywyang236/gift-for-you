// component/Eraser/Eraser.tsx
import React, {useState, useEffect} from 'react';

interface EraserProps {
    context: CanvasRenderingContext2D | null;
    eraserSize: number;
    mousePosition?: {x: number; y: number};
}

const Eraser: React.FC<EraserProps> = ({context, eraserSize, mousePosition}) => {
    const erase = (x: number, y: number) => {
        if (context) {
            context.globalCompositeOperation = 'destination-out';
            context.beginPath();
            context.arc(x, y, eraserSize / 2, 0, Math.PI * 2);
            context.fill();
        }
    };

    return null;
};

export default Eraser;
