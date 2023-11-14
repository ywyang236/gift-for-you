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
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<{x: number; y: number} | undefined>(undefined);
    const dispatch = useDispatch();
    const isBrushActive = useSelector((state: RootState) => state.brush.isBrushActive);
    const brushSize = useSelector((state: RootState) => state.brush.brushSize);
    const brushColor = useSelector((state: RootState) => state.brush.brushColor);

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

    // 新增的 useEffect 用來繪製預覽圓
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context && mousePosition && isBrushActive) {
            if (!isPainting) {
                // 只有在非繪畫狀態時才繪製預覽
                context.save(); // 保存當前畫布狀態
                clearCanvas(context, width, height); // 清除上次的預覽
                drawPreview(context, mousePosition.x, mousePosition.y, brushSize, brushColor);
                context.restore(); // 恢復畫布狀態，保持繪畫內容不變
            }
        } else if (context) {
            // 當畫筆不活躍時清除預覽
            clearCanvas(context, width, height);
        }
    }, [mousePosition, isBrushActive, brushSize, brushColor, isPainting, width, height]);

    // 繪製預覽的函數
    const drawPreview = (context: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
        context.beginPath();
        context.arc(x, y, size / 2, 0, Math.PI * 2);
        context.fillStyle = color + '40'; // 加上透明度
        context.fill();
    };

    // 新增一個函數用來清除畫布
    const clearCanvas = (context: CanvasRenderingContext2D, width: number, height: number) => {
        context.clearRect(0, 0, width, height);
    };

    // 更新 onMouseMove 事件處理器來設置鼠標位置
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

    // 新增 onMouseEnter 和 onMouseLeave 事件處理器來控制預覽的顯示
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

        // 在開始繪畫之前清除預覽
        // clearCanvas(context, width, height);

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

        // clearCanvas(context, width, height);
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
            // onMouseMove={draw}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        />
    );
};

export default Canvas;