// components/Canvas/Canvas.tsx
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';
import CanvasCSS from "./Canvas.module.css";
import BackgroundHighlighter from './BackgroundHighlighter';
import BrushPreviewSVG from '../Brush/BrushPreviewSVG';
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

interface Point {
    x: number;
    y: number;
}

const Canvas: React.FC<CanvasProps> = ({width, height, handleExportSVG, paths, setPaths}) => {
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<{x: number; y: number} | undefined>(undefined);
    const isBrushActive = useSelector((state: RootState) => state.brush.isBrushActive);
    const brushSize = useSelector((state: RootState) => state.brush.brushSize);
    const brushColor = useSelector((state: RootState) => state.brush.brushColor);
    const isEraserActive = useSelector((state: RootState) => state.eraser.isEraserActive);

    const clearCanvas = (context: CanvasRenderingContext2D, width: number, height: number) => {
        context.clearRect(0, 0, width, height);
    };

    const pointsToSvgPath = (points: Point[]): string => {
        return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`).join(' ');
    };

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const svgRect = event.currentTarget.getBoundingClientRect();
        const newPoint: Point = {
            x: event.clientX - svgRect.left,
            y: event.clientY - svgRect.top,
        };

        setMousePosition(newPoint);

        if (isPainting) {
            setPaths((prevPaths) => {
                const newPaths = [...prevPaths];
                const currentPath = newPaths[newPaths.length - 1];
                currentPath.points.push(newPoint);
                return newPaths;
            });
        }
    };

    const handleMouseLeave = () => {
        setMousePosition(undefined);
    };

    const startPainting = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (isEraserActive) return;
        setIsPainting(true);
        const svgRect = event.currentTarget.getBoundingClientRect();
        const newPoint: Point = {
            x: event.clientX - svgRect.left,
            y: event.clientY - svgRect.top,
        };
        setPaths((prevPaths) => [...prevPaths, {points: [newPoint], brushSize, brushColor}]);
    };

    const endPainting = () => {
        setIsPainting(false);
    };

    const pathToSvgPath = (points: Point[]): string => {
        return points.map((point, index) =>
            `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
        ).join(' ');
    };

    return (
        <>
            <BackgroundHighlighter width={width} height={height} active={isPainting}>
                <svg
                    width={width}
                    height={height}
                    className={CanvasCSS.canvas}
                    onMouseDown={startPainting}
                    onMouseMove={handleMouseMove}
                    onMouseUp={endPainting}
                    onMouseLeave={handleMouseLeave}
                >
                    {paths.map((path, index) => (
                        <path
                            key={index}
                            d={pathToSvgPath(path.points)}
                            stroke={path.brushColor}
                            strokeWidth={path.brushSize}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    ))}
                    <BrushPreviewSVG
                        width={width}
                        height={height}
                        brushSize={brushSize}
                        brushColor={brushColor}
                        mousePosition={mousePosition}
                        isBrushActive={isBrushActive}
                    />
                </svg>
            </BackgroundHighlighter>

        </>
    );
};

export default Canvas;