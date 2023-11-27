// components/Canvas/Canvas.tsx
import React, {useRef, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';
import CanvasCSS from "./Canvas.module.css";
import Eraser from '../Eraser/Eraser';
import BackgroundHighlighter from './BackgroundHighlighter';
import BrushPreview from '../Brush/BrushPreview';

interface CanvasProps {
    width: number;
    height: number;
    isBrushActive: boolean;
    setBrushSize: (newBrushSize: number) => void;
    setBrushColor: (newBrushColor: string) => void;
    handleExportSVG: () => void;
    paths: Array<{points: Array<{x: number; y: number}>, brushSize: number, brushColor: string}>;
    setPaths: React.Dispatch<React.SetStateAction<Array<{points: Array<{x: number; y: number}>, brushSize: number, brushColor: string}>>>;

}

const Canvas: React.FC<CanvasProps> = ({width, height, handleExportSVG, paths, setPaths}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewBrushCanvasRef = useRef<HTMLCanvasElement>(null);
    const previewEraserCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<{x: number; y: number} | undefined>(undefined);
    const dispatch = useDispatch();
    const isBrushActive = useSelector((state: RootState) => state.brush.isBrushActive);
    const brushSize = useSelector((state: RootState) => state.brush.brushSize);
    const brushColor = useSelector((state: RootState) => state.brush.brushColor);
    const [backgroundColor, setBackgroundColor] = useState('transparent');
    const isEraserActive = useSelector((state: RootState) => state.eraser.isEraserActive);
    const eraserSize = useSelector((state: RootState) => state.eraser.eraserSize);
    const [isErasing, setIsErasing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (context) {
            context.strokeStyle = brushColor || 'black';
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.lineWidth = brushSize;
        }
    }, [brushSize, brushColor]);

    useEffect(() => {
        const context = canvasRef.current?.getContext('2d');
        if (context) {
            clearCanvas(context, width, height);

            paths.forEach((path) => {
                context.strokeStyle = path.brushColor;
                context.lineWidth = path.brushSize;
                context.beginPath();
                path.points.forEach((point, index) => {
                    if (index === 0) {
                        context.moveTo(point.x, point.y);
                    } else {
                        context.lineTo(point.x, point.y);
                    }
                });
                context.stroke();
            });
        }
    }, [paths, width, height]);

    useEffect(() => {
        const previewEraserContext = previewEraserCanvasRef.current?.getContext('2d');
        if (previewEraserContext && mousePosition && isEraserActive && !isErasing) {
            clearCanvas(previewEraserContext, width, height);
            drawEraserPreview(previewEraserContext, mousePosition.x, mousePosition.y, eraserSize);
        }
    }, [mousePosition, isEraserActive, eraserSize, isErasing, width, height]);

    const drawEraserPreview = (context: CanvasRenderingContext2D, x: number, y: number, size: number) => {
        context.beginPath();
        context.arc(x, y, size / 2, 0, Math.PI * 2);
        context.strokeStyle = 'rgba(0,0,0, 0.5)';
        context.stroke();
        context.fillStyle = '#f5a19d';
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

        if (isBrushActive || isEraserActive) {
            setMousePosition({x, y});
        }

        if (isPainting && !isEraserActive) {
            const newPoint = {x, y};

            const context = canvasRef.current?.getContext('2d');
            if (context) {
                if (mousePosition) {
                    context.beginPath();
                    context.moveTo(mousePosition.x, mousePosition.y);
                    context.lineTo(newPoint.x, newPoint.y);
                    context.stroke();
                }
                setMousePosition(newPoint);

                setPaths(prevPaths => {
                    const newPaths = [...prevPaths];
                    const currentPath = newPaths[newPaths.length - 1];
                    currentPath.points.push(newPoint);
                    return newPaths;
                });
            }
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
        const previewContext = previewBrushCanvasRef.current?.getContext('2d');
        if (previewContext) {
            clearCanvas(previewContext, width, height);
        }

        const previewEraserContext = previewEraserCanvasRef.current?.getContext('2d');
        if (previewEraserContext) {
            clearCanvas(previewEraserContext, width, height);
        }
        setMousePosition(undefined);
    };

    const startPainting = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const context = canvasRef.current?.getContext('2d');
        if (!context || isEraserActive) return;

        context.globalCompositeOperation = 'source-over';

        const rect = canvasRef.current!.getBoundingClientRect();
        if (!rect) return;

        const x = event.nativeEvent.clientX - rect.left;
        const y = event.nativeEvent.clientY - rect.top;

        if (isBrushActive && !isEraserActive) {
            setPaths(prevPaths => [...prevPaths, {points: [{x, y}], brushSize, brushColor}]);
            setIsPainting(true);
        }
    };

    const endPainting = () => {
        const context = canvasRef.current?.getContext('2d');
        if (!context) return;

        if (!isEraserActive) {
            context.closePath();
            setIsPainting(false);
        }
    };

    return (
        <>
            <BackgroundHighlighter width={width} height={height} active={isPainting || isErasing}>
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
                <BrushPreview
                    width={width}
                    height={height}
                    brushSize={brushSize}
                    brushColor={brushColor}
                    mousePosition={mousePosition}
                    isBrushActive={isBrushActive && !isPainting}
                />
                <canvas
                    ref={previewEraserCanvasRef}
                    width={width}
                    height={height}
                    style={{
                        position: 'relative',
                        top: -851,
                        left: 0,
                        pointerEvents: 'none',
                        // backgroundColor: 'rgba(255, 139, 0, 0.3)',
                    }}
                />
                {isEraserActive && (
                    <Eraser
                        canvasRef={canvasRef}
                        width={width}
                        height={height}
                        isEraserActive={isEraserActive}
                        setBackgroundColor={setBackgroundColor}
                    />
                )}
            </BackgroundHighlighter>
        </>
    );
};

export default Canvas;