// components/Canvas/Canvas.tsx
import React, {useRef, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';
import CanvasCSS from "./Canvas.module.css";
import {set} from 'firebase/database';

interface CanvasProps {
    width: number;
    height: number;
    isBrushActive: boolean;
    setBrushSize: (newBrushSize: number) => void;
    setBrushColor: (newBrushColor: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<{x: number; y: number} | undefined>(undefined);
    const dispatch = useDispatch();
    const isBrushActive = useSelector((state: RootState) => state.brush.isBrushActive);
    const brushSize = useSelector((state: RootState) => state.brush.brushSize);
    const brushColor = useSelector((state: RootState) => state.brush.brushColor);
    const [backgroundColor, setBackgroundColor] = useState('transparent');

    const toggleBackgroundColor = () => {
        setBackgroundColor(prevColor =>
            prevColor === 'transparent' ? 'rgba(255, 139, 0, 0.3)' : 'transparent'
        );
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context) {
            context.strokeStyle = brushColor;
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.lineWidth = brushSize;
        }
    }, [brushSize, brushColor]);

    useEffect(() => {
        const previewContext = previewCanvasRef.current?.getContext('2d');
        if (previewContext && mousePosition && isBrushActive && !isPainting) {
            clearCanvas(previewContext, width, height);
            drawPreview(previewContext, mousePosition.x, mousePosition.y, brushSize, brushColor); // Draw on the preview canvas
        }
    }, [mousePosition, isBrushActive, brushSize, brushColor, isPainting, width, height]);

    const drawPreview = (context: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
        context.beginPath();
        context.arc(x, y, size / 2, 0, Math.PI * 2);
        context.fillStyle = color + '40';
        context.fill();
    };

    const clearCanvas = (context: CanvasRenderingContext2D, width: number, height: number) => {
        context.clearRect(0, 0, width, height);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (isPainting) {
            const context = canvasRef.current?.getContext('2d');
            if (!context) return;

            context.lineTo(x, y);
            context.stroke();
        } else if (isBrushActive) {
            setMousePosition({x, y});
        }
    };

    const handleMouseEnter = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (isBrushActive) {
            const rect = canvasRef.current?.getBoundingClientRect();
            setMousePosition({
                x: event.clientX - (rect?.left ?? 0),
                y: event.clientY - (rect?.top ?? 0)
            });
        }
    };

    const handleMouseLeave = () => {
        const previewContext = previewCanvasRef.current?.getContext('2d');
        if (previewContext) {
            clearCanvas(previewContext, width, height);
        }
        setMousePosition(undefined);
    };


    const startPainting = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const context = canvasRef.current?.getContext('2d');
        if (!context) return;
        if (!isBrushActive) return;

        const rect = canvasRef.current!.getBoundingClientRect();
        if (!rect) return;

        const x = event.nativeEvent.clientX - rect.left;
        const y = event.nativeEvent.clientY - rect.top;

        context.moveTo(x, y);
        context.beginPath();
        toggleBackgroundColor();
        setIsPainting(true);
    };

    const endPainting = () => {
        const context = canvasRef.current?.getContext('2d');
        if (!context) return;
        context.closePath();
        setIsPainting(false);
        toggleBackgroundColor();
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{backgroundColor: backgroundColor}}
                className={CanvasCSS.canvas}
                onMouseDown={startPainting}
                onMouseUp={endPainting}
                onMouseOut={endPainting}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            <canvas
                ref={previewCanvasRef}
                width={width}
                height={height}
                style={{
                    position: 'relative',
                    top: -426,
                    left: 0,
                    pointerEvents: 'none',
                }}
            />
        </>
    );
};

export default Canvas;