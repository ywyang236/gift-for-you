// components/Canvas/Canvas.tsx
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';
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
    uploadedImage: string | null;
    isDraggingEnabled: boolean;
}

interface Point {
    x: number;
    y: number;
}

const Canvas: React.FC<CanvasProps> = ({width, height, paths, setPaths, uploadedImage}) => {
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<{x: number; y: number} | undefined>(undefined);
    const isBrushActive = useSelector((state: RootState) => state.brush.isBrushActive);
    const brushSize = useSelector((state: RootState) => state.brush.brushSize);
    const brushColor = useSelector((state: RootState) => state.brush.brushColor);
    const isEraserActive = useSelector((state: RootState) => state.eraser.isEraserActive);
    const [isErasing, setIsErasing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedPathIndex, setSelectedPathIndex] = useState<number | null>(null);
    const [dragStart, setDragStart] = useState<Point | null>(null);
    const [originalPathPoints, setOriginalPathPoints] = useState<Array<Point>>([]);
    const [isDragActive, setIsDragActive] = useState(false);

    const toggleDragMode = () => {
        setIsDragActive(!isDragActive);
        setIsDragging(false);
    };

    const selectPath = (index: number, event: React.MouseEvent<SVGElement, MouseEvent>) => {
        const svgEvent = event as unknown as React.MouseEvent<SVGSVGElement, MouseEvent>;
        if (isDragActive) {
            setIsDragging(true);

            setSelectedPathIndex(index);
            const svgRect = event.currentTarget.getBoundingClientRect();
            const mousePoint = adjustForScale(event.clientX, event.clientY, svgRect, 1); // 定义 mousePoint

            const originalPath = paths[index];
            setOriginalPathPoints([...originalPath.points]);

            let closestPoint = originalPath.points.reduce((closest, currentPoint) => {
                const distToCurrentPoint = Math.hypot(currentPoint.x - mousePoint.x, currentPoint.y - mousePoint.y);
                const distToClosestPoint = Math.hypot(closest.x - mousePoint.x, closest.y - mousePoint.y);
                return distToCurrentPoint < distToClosestPoint ? currentPoint : closest;
            }, originalPath.points[0]);

            setDragStart(closestPoint);
        }
    };

    const movePath = (newPoint: Point) => {
        if (selectedPathIndex !== null && dragStart && originalPathPoints && isDragActive && isDragging) {
            const dx = newPoint.x - dragStart.x;
            const dy = newPoint.y - dragStart.y

            setPaths((prevPaths) => {
                const newPaths = [...prevPaths];
                const path = newPaths[selectedPathIndex];
                path.points = originalPathPoints.map(point => ({
                    x: point.x + dx,
                    y: point.y + dy
                }));
                return newPaths;
            });
        }
    };

    const adjustForScale = (clientX: number, clientY: number, svgRect: DOMRect, scale: number) => {
        const adjustedX = (clientX - svgRect.left) / scale;
        const adjustedY = (clientY - svgRect.top) / scale;

        return {
            x: adjustedX,
            y: adjustedY,
        };
    };

    const startErasing = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (!isEraserActive) return;
        setIsErasing(true);
    };

    const endErasing = () => {
        setIsErasing(false);
    };

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const svgRect = event.currentTarget.getBoundingClientRect();
        const scale = 1;
        const newPoint = adjustForScale(event.clientX, event.clientY, svgRect, scale);

        setMousePosition(newPoint);

        if (isPainting) {
            setPaths((prevPaths) => {
                const newPaths = [...prevPaths];
                const currentPath = newPaths[newPaths.length - 1];
                currentPath.points.push(newPoint);
                return newPaths;
            });
        }

        if (event.buttons === 1 && isDragging && selectedPathIndex !== null) {
            movePath(newPoint);
        }
    };

    const handleMouseLeave = () => {
        setMousePosition(undefined);
    };

    const startPainting = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (!isBrushActive || isEraserActive) return;
        setIsPainting(true);
        const svgRect = event.currentTarget.getBoundingClientRect();
        const newPoint = adjustForScale(event.clientX, event.clientY, svgRect, 1);
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
            <button onClick={toggleDragMode}>
                {isDragActive ? '停止拖移模式' : '啟動拖移模式'}
            </button>

            <BackgroundHighlighter
                width={width}
                height={height}
                active={isPainting || isErasing}
            >
                <svg
                    width={width}
                    height={height}
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
                            onMouseDown={(e) => selectPath(index, e)}
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
                    {uploadedImage && (
                        <image href={uploadedImage} x="0" y="0" width={width} height={height} />
                    )}
                </svg>
            </BackgroundHighlighter>
        </>
    );
};

export default Canvas;