// components/Canvas/Canvas.tsx
import React, {useRef, useEffect, useState, MouseEvent} from 'react';
import CanvasCSS from "./Canvas.module.css";

interface CanvasProps {
    width: number;
    height: number;
    isBrushActive: boolean;  // 增加 prop 控制畫筆功能
}

const Canvas: React.FC<CanvasProps> = ({width, height, isBrushActive}) => {  // 增加 isBrushActive
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context) {
            context.strokeStyle = '#000000';
            context.lineWidth = 2;
        }
    }, []);

    const startPainting = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const context = canvasRef.current?.getContext('2d');
        if (!context) return;
        if (!isBrushActive) return; // 檢查是否啟用畫筆功能
        setIsPainting(true);
        draw(e);
    };

    const endPainting = () => {
        const context = canvasRef.current?.getContext('2d');
        if (!context) return;
        setIsPainting(false);
        context.beginPath();
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isPainting) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvasRef.current?.getContext('2d');
        if (!context) return;

        const nativeEvent = e.nativeEvent;
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