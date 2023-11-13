// components/Canvas/Canvas.tsx
import React, {useRef, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';
import CanvasCSS from "./Canvas.module.css";

interface CanvasProps {
    width: number;
    height: number;
    isBrushActive: boolean;
    setLineWidth: (newLineWidth: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({width, height}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const dispatch = useDispatch();
    const isBrushActive = useSelector((state: RootState) => state.brush.isBrushActive);
    const lineWidth = useSelector((state: RootState) => state.brush.lineWidth);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context) {
            context.strokeStyle = '#000000';
            context.lineWidth = lineWidth;
        }
    }, [lineWidth]);

    const startPainting = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const context = canvasRef.current?.getContext('2d');
        if (!context) return;
        if (!isBrushActive) return;
        setIsPainting(true);
        draw(event);
    };

    const endPainting = () => {
        const context = canvasRef.current?.getContext('2d');
        if (!context) return;
        setIsPainting(false);
        context.beginPath();
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isPainting) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvasRef.current?.getContext('2d');
        if (!context) return;

        const nativeEvent = event.nativeEvent;
        const rect = canvas.getBoundingClientRect();
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