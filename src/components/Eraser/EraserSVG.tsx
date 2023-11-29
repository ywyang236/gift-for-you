// components/Eraser/EraserSVG.tsx
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';

interface EraserSVGProps {
    paths: Array<{points: Array<{x: number; y: number}>, brushSize: number, brushColor: string}>;
    setPaths: React.Dispatch<React.SetStateAction<Array<{points: Array<{x: number; y: number}>, brushSize: number, brushColor: string}>>>;
    mousePosition?: {x: number; y: number};
    isEraserActive: boolean;
}

const EraserSVG: React.FC<EraserSVGProps> = ({paths, setPaths, mousePosition, isEraserActive}) => {
    const eraserSize = useSelector((state: RootState) => state.eraser.eraserSize);

    const erasePath = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        if (!isEraserActive || !mousePosition) return;

        const isPathInEraserArea = (path: {points: Array<{x: number; y: number}>, brushSize: number, brushColor: string}) => {
            return path.points.some(point =>
                Math.abs(point.x - mousePosition.x) <= eraserSize &&
                Math.abs(point.y - mousePosition.y) <= eraserSize
            );
        };

        const newPaths = paths.filter(path => !isPathInEraserArea(path));
        setPaths(newPaths);
    };

    return (
        <svg
            width="100%"
            height="100%"
            onMouseDown={erasePath}
            style={{cursor: isEraserActive ? 'crosshair' : 'default'}}
        >
            {isEraserActive && mousePosition && (
                <rect
                    x={mousePosition.x - eraserSize / 2}
                    y={mousePosition.y - eraserSize / 2}
                    width={eraserSize}
                    height={eraserSize}
                    fill="rgba(255,255,255,0.5)"
                />
            )}
        </svg>
    );
};

export default EraserSVG;