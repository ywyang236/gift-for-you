// components/Canvas/Canvas.tsx
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';
import CanvasCSS from "./Canvas.module.css";
// import Eraser from '../Eraser/Eraser';
import BackgroundHighlighter from './BackgroundHighlighter';
// import BrushPreview from '../Brush/BrushPreview';

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
    // const canvasRef = useRef<HTMLCanvasElement>(null);
    // const previewBrushCanvasRef = useRef<HTMLCanvasElement>(null);
    // const previewEraserCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] = useState<{x: number; y: number} | undefined>(undefined);
    // const dispatch = useDispatch();
    const isBrushActive = useSelector((state: RootState) => state.brush.isBrushActive);
    const brushSize = useSelector((state: RootState) => state.brush.brushSize);
    const brushColor = useSelector((state: RootState) => state.brush.brushColor);
    // const [backgroundColor, setBackgroundColor] = useState('transparent');
    const isEraserActive = useSelector((state: RootState) => state.eraser.isEraserActive);
    // const eraserSize = useSelector((state: RootState) => state.eraser.eraserSize);
    // const [isErasing, setIsErasing] = useState(false);

    // useEffect(() => {
    //     const canvas = canvasRef.current;
    //     const context = canvas?.getContext('2d');
    //     if (context) {
    //         context.strokeStyle = brushColor || 'black';
    //         context.lineJoin = 'round';
    //         context.lineCap = 'round';
    //         context.lineWidth = brushSize;
    //     }
    // }, [brushSize, brushColor]);

    // useEffect(() => {
    //     const context = canvasRef.current?.getContext('2d');
    //     if (context) {
    //         clearCanvas(context, width, height);

    //         paths.forEach((path) => {
    //             context.strokeStyle = path.brushColor;
    //             context.lineWidth = path.brushSize;
    //             context.beginPath();
    //             path.points.forEach((point, index) => {
    //                 if (index === 0) {
    //                     context.moveTo(point.x, point.y);
    //                 } else {
    //                     context.lineTo(point.x, point.y);
    //                 }
    //             });
    //             context.stroke();
    //         });
    //     }
    // }, [paths, width, height]);

    // useEffect(() => {
    //     const previewEraserContext = previewEraserCanvasRef.current?.getContext('2d');
    //     if (previewEraserContext && mousePosition && isEraserActive && !isErasing) {
    //         clearCanvas(previewEraserContext, width, height);
    //         drawEraserPreview(previewEraserContext, mousePosition.x, mousePosition.y, eraserSize);
    //     }
    // }, [mousePosition, isEraserActive, eraserSize, isErasing, width, height]);

    // const drawEraserPreview = (context: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    //     context.beginPath();
    //     context.arc(x, y, size / 2, 0, Math.PI * 2);
    //     context.strokeStyle = 'rgba(0,0,0, 0.5)';
    //     context.stroke();
    //     context.fillStyle = '#f5a19d';
    //     context.fill();
    // };

    const clearCanvas = (context: CanvasRenderingContext2D, width: number, height: number) => {
        context.clearRect(0, 0, width, height);
    };

    const pointsToSvgPath = (points: Point[]): string => {
        return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`).join(' ');
    };

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (!isPainting) return;

        const svgRect = event.currentTarget.getBoundingClientRect();
        const newPoint: Point = {
            x: event.clientX - svgRect.left,
            y: event.clientY - svgRect.top,
        };

        setMousePosition(newPoint);
        setPaths((prevPaths) => {
            const newPaths = [...prevPaths];
            const currentPath = newPaths[newPaths.length - 1];
            currentPath.points.push(newPoint);
            return newPaths;
        });
    };

    // const handleMouseEnter = (event: React.MouseEvent<HTMLCanvasElement>) => {
    //     if (isBrushActive) {
    //         const rect = canvasRef.current?.getBoundingClientRect();
    //         setMousePosition({
    //             x: event.clientX - (rect?.left ?? 0),
    //             y: event.clientY - (rect?.top ?? 0)
    //         });
    //     }
    // };

    const handleMouseLeave = () => {
        // const previewContext = previewBrushCanvasRef.current?.getContext('2d');
        // if (previewContext) {
        //     clearCanvas(previewContext, width, height);
        // }

        // const previewEraserContext = previewEraserCanvasRef.current?.getContext('2d');
        // if (previewEraserContext) {
        //     clearCanvas(previewEraserContext, width, height);
        // }
        setMousePosition(undefined);
    };

    const startPainting = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (isEraserActive) return;
        setIsPainting(true);
        const newPoint = {x: event.clientX, y: event.clientY};
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
                    // ref={canvasRef}
                    width={width}
                    height={height}
                    // style={{backgroundColor: backgroundColor}}
                    className={CanvasCSS.canvas}
                    onMouseDown={startPainting}
                    onMouseMove={handleMouseMove}
                    onMouseUp={endPainting}
                    // onMouseOut={endPainting}
                    // onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {paths.map((path, index) => (
                        <path
                            key={index}
                            d={pathToSvgPath(path.points)}
                            stroke={path.brushColor}
                            strokeWidth={path.brushSize}
                            fill="none"
                        />
                    ))}
                </svg>
                {/* <BrushPreview
                    width={width}
                    height={height}
                    brushSize={brushSize}
                    brushColor={brushColor}
                    mousePosition={mousePosition}
                    isBrushActive={isBrushActive && !isPainting}
                />
                <canvas
                    // ref={previewEraserCanvasRef}
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
                        // canvasRef={canvasRef}
                        width={width}
                        height={height}
                        isEraserActive={isEraserActive}
                        setBackgroundColor={setBackgroundColor}
                    />
                )} */}
            </BackgroundHighlighter>
        </>
    );
};

export default Canvas;