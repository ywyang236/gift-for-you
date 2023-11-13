// components/Canvas/Canvas.tsx
import React, {useRef, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';
import CanvasCSS from "./Canvas.module.css";

interface CanvasProps {
    width: number;
    height: number;
    isBrushActive: boolean;
    setBrushSize: (newBrushSize: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const dispatch = useDispatch();
    const isBrushActive = useSelector((state: RootState) => state.brush.isBrushActive);
    const brushSize = useSelector((state: RootState) => state.brush.brushSize);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context) {
            context.strokeStyle = '#000000';
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.lineWidth = brushSize;
        }
    }, [brushSize]);

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

    const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isPainting) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvasRef.current?.getContext('2d');
        if (!context) return;

        const rect = canvas.getBoundingClientRect();
        if (!rect) return;

        const x = event.nativeEvent.clientX - rect.left;
        const y = event.nativeEvent.clientY - rect.top;

        const nativeEvent = event.nativeEvent;
        context.lineTo(nativeEvent.clientX - rect.left, nativeEvent.clientY - rect.top);
        context.stroke();
        context.beginPath();
        context.moveTo(nativeEvent.clientX - rect.left, nativeEvent.clientY - rect.top);
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{backgroundColor: 'rgba(255, 139, 0, 0.3)'}}
            className={CanvasCSS.canvas}
            onMouseDown={startPainting}
            onMouseUp={endPainting}
            onMouseOut={endPainting}
            onMouseMove={draw}
        />
    );
};

export default Canvas;