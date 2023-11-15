// components/Canvas/Canvas.tsx
import React, {useRef, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';
import CanvasCSS from "./Canvas.module.css";
import {set} from 'firebase/database';
import BrushPreview from '../BrushPreview/BrushPreview';
import Eraser from '../Eraser/Eraser';

interface CanvasProps {
    width: number;
    height: number;
    isBrushActive: boolean;
    setBrushSize: (newBrushSize: number) => void;
    setBrushColor: (newBrushColor: string) => void;
    isEraserActive: boolean;
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
    const [isErasing, setIsErasing] = useState(false);
    const eraserSize = useSelector((state: RootState) => state.eraser.eraserSize);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const isEraserActive = useSelector((state: RootState) => state.eraser.isEraserActive);

    useEffect(() => {
        if (canvasRef.current) {
            const newContext = canvasRef.current.getContext('2d');
            setContext(newContext);
        }
    }, []);


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

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (isPainting && !isEraserActive) {
            context.globalCompositeOperation = 'source-over';
            context.lineTo(x, y);
            context.stroke();
        }

        if (isPainting && isEraserActive) {
            context.globalCompositeOperation = 'destination-out';
            context.beginPath();
            context.arc(x, y, brushSize / 2, 0, Math.PI * 2);
            context.fill();
        }

        if (!isPainting && isBrushActive) {
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
        setIsPainting(true);
    };

    const endPainting = () => {
        const context = canvasRef.current?.getContext('2d');
        if (!context) return;
        context.closePath();
        setIsPainting(false);
    };

    return (
        <>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{backgroundColor: 'rgba(255, 139, 0, 0.3)'}}
                className={CanvasCSS.canvas}
                onMouseDown={startPainting}
                onMouseUp={endPainting}
                onMouseOut={endPainting}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            {isBrushActive && mousePosition && (
                <BrushPreview
                    width={width}
                    height={height}
                    brushSize={brushSize}
                    brushColor={brushColor}
                    mousePosition={mousePosition}
                />
            )}
            {isErasing && mousePosition && (
                <Eraser
                    context={context}
                    eraserSize={eraserSize}
                />
            )}
        </>
    );
};

export default Canvas;