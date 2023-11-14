// components/BrushPreview/BrushPreview.tsx
import React, {useRef, useEffect} from 'react';

interface BrushPreviewProps {
    width: number;
    height: number;
    brushSize: number;
    brushColor: string;
    mousePosition: {x: number; y: number} | undefined;
}

const BrushPreview: React.FC<BrushPreviewProps> = ({
    width,
    height,
    brushSize,
    brushColor,
    mousePosition,
}) => {
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const previewContext = previewCanvasRef.current?.getContext('2d');
        if (previewContext && mousePosition) {
            clearCanvas(previewContext, width, height);
            drawPreview(previewContext, mousePosition.x, mousePosition.y, brushSize, brushColor);
        }
    }, [mousePosition, brushSize, brushColor, width, height]);

    const drawPreview = (context: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
        context.beginPath();
        context.arc(x, y, size / 2, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
    };

    const clearCanvas = (context: CanvasRenderingContext2D, width: number, height: number) => {
        context.clearRect(0, 0, width, height);
    };

    return (
        <canvas
            ref={previewCanvasRef}
            width={width}
            height={height}
            style={{
                position: 'relative',
                top: -426,
                left: 0,
                pointerEvents: 'none',
                // backgroundColor: 'rgba(255, 139, 0, 0.3)',
            }}
        />
    );
};

export default BrushPreview;
