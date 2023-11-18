// components/Eraser/Eraser.tsx
import React, {useEffect, useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';

interface EraserProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    width: number;
    height: number;
    isEraserActive: boolean;
    setBackgroundColor: (color: string) => void;
}

const Eraser: React.FC<EraserProps> = ({canvasRef, width, height, setBackgroundColor}) => {
    const eraserSize = useSelector((state: RootState) => state.eraser.eraserSize);
    const isEraserActive = useSelector((state: RootState) => state.eraser.isEraserActive);
    const [isErasing, setIsErasing] = useState(false);
    const [lastPosition, setLastPosition] = useState<{x: number; y: number} | undefined>(undefined);

    const toggleBackgroundColor = (currentColor: string) => {
        setBackgroundColor(
            currentColor === 'transparent' ? 'rgba(255, 139, 0, 0.3)' : 'transparent'
        );
    };

    const handleMouseMove = useCallback((event: MouseEvent) => {
        if (!isEraserActive || !isErasing) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const context = canvasRef.current?.getContext('2d');
        if (context && lastPosition) {
            context.globalCompositeOperation = 'destination-out';
            context.beginPath();
            context.moveTo(lastPosition.x, lastPosition.y);
            context.lineTo(x, y);
            context.strokeStyle = 'rgba(0,0,0,1)';
            context.lineWidth = eraserSize;
            context.stroke();
        }
        setLastPosition({x, y});
    }, [isEraserActive, isErasing, lastPosition, eraserSize, canvasRef]);


    const startErasing = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isEraserActive) return;

        setIsErasing(true);
        setBackgroundColor('rgba(255, 139, 0, 0.3)');
        const rect = canvasRef.current?.getBoundingClientRect();
        const x = event.clientX - (rect?.left ?? 0);
        const y = event.clientY - (rect?.top ?? 0);
        setLastPosition({x, y});
    }, [isEraserActive, canvasRef, setBackgroundColor]);


    const stopErasing = useCallback(() => {
        setIsErasing(false);
        setBackgroundColor('transparent');
        setLastPosition(undefined);
    }, [setBackgroundColor]);


    useEffect(() => {
        const canvasElement = canvasRef.current;
        if (canvasElement) {
            canvasElement.addEventListener('mousedown', startErasing as any);
            canvasElement.addEventListener('mouseup', stopErasing);
            canvasElement.addEventListener('mouseleave', stopErasing);
            canvasElement.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            canvasElement?.removeEventListener('mousedown', startErasing as any);
            canvasElement?.removeEventListener('mouseup', stopErasing);
            canvasElement?.removeEventListener('mouseleave', stopErasing);
            canvasElement?.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isEraserActive, eraserSize, isErasing, lastPosition, handleMouseMove, startErasing, stopErasing, canvasRef]);

    return null;
};

export default Eraser;
