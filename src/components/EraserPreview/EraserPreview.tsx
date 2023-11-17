// component/EraserPreview/EraserPreview.tsx
import React, {useRef, useEffect} from 'react';

interface EraserPreviewProps {
    width: number;
    height: number;
    eraserSize: number;
    mousePosition: {x: number; y: number} | undefined;
}

const EraserPreview: React.FC<EraserPreviewProps> = ({
    width,
    height,
    eraserSize,
    mousePosition,
}) => {
    const previewEraserCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const previewContext = previewEraserCanvasRef.current?.getContext('2d');
        if (previewContext && mousePosition) {
            clearCanvas(previewContext, width, height);
            eraserPreview(previewContext, mousePosition.x, mousePosition.y, eraserSize);
        }
    }, [mousePosition, eraserSize, width, height]);

    const eraserPreview = (context: CanvasRenderingContext2D, x: number, y: number, size: number) => {
        context.beginPath();
        context.arc(x, y, size / 2, 0, Math.PI * 2);
        context.fillStyle = '#f5a19d';
        context.strokeStyle = '#000000';
        context.fill();
    }
    const clearCanvas = (context: CanvasRenderingContext2D, width: number, height: number) => {
        context.clearRect(0, 0, width, height);
    };

    return (
        <canvas
            ref={previewEraserCanvasRef}
            width={width}
            height={height}
            style={{
                position: 'relative',
                top: -426,
                left: 0,
                pointerEvents: 'none',
            }}
        />
    );
};

export default EraserPreview;