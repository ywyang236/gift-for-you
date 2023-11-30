// components/Canvas/Canvas.tsx
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';
import CanvasCSS from "./Canvas.module.css";
import BackgroundHighlighter from './BackgroundHighlighter';
import BrushPreviewSVG from '../Brush/BrushPreviewSVG';
import EraserSVG from '../Eraser/EraserSVG';
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

const Canvas: React.FC<CanvasProps> = ({width, height, paths, setPaths}) => {
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<{x: number; y: number} | undefined>(undefined);
    const isBrushActive = useSelector((state: RootState) => state.brush.isBrushActive);
    const brushSize = useSelector((state: RootState) => state.brush.brushSize);
    const brushColor = useSelector((state: RootState) => state.brush.brushColor);
    const isEraserActive = useSelector((state: RootState) => state.eraser.isEraserActive);
    const [isErasing, setIsErasing] = useState(false);

    const startErasing = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (!isEraserActive) return;
        setIsErasing(true);
    };

    const endErasing = () => {
        setIsErasing(false);
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
        if (!isBrushActive || isEraserActive) return;
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
            <BackgroundHighlighter
                width={width}
                height={height}
                active={isPainting || isErasing}
            >
                <svg
                    width={width}
                    height={height}
                    className={CanvasCSS.canvas}
                    onMouseDown={(e) => {
                        if (isBrushActive) startPainting(e);
                        if (isEraserActive) startErasing(e);
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={() => {
                        endPainting();
                        endErasing();
                    }}
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
                    <EraserSVG
                        paths={paths}
                        setPaths={setPaths}
                        mousePosition={mousePosition}
                        isEraserActive={isEraserActive}
                    />
                </svg>
            </BackgroundHighlighter>
        </>
    );
};

export default Canvas;