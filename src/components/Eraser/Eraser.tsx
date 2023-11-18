// components/Eraser/Eraser.tsx
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';

interface EraserProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    width: number;
    height: number;
    isEraserActive: boolean;
}

const Eraser: React.FC<EraserProps> = ({canvasRef, width, height}) => {
    const eraserSize = useSelector((state: RootState) => state.eraser.eraserSize);
    const isEraserActive = useSelector((state: RootState) => state.eraser.isEraserActive);
    const [isErasing, setIsErasing] = useState(false);

    const erase = (x: number, y: number) => {
        const context = canvasRef.current?.getContext('2d');
        if (context && isErasing) {
            context.globalCompositeOperation = 'destination-out';
            context.beginPath();
            context.arc(x, y, eraserSize / 2, 0, Math.PI * 2);
            context.fill();
            context.closePath();
        }
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isEraserActive || !isErasing) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = event.clientX - (rect?.left ?? 0);
        const y = event.clientY - (rect?.top ?? 0);
        erase(x, y);
    };

    const startErasing = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (isEraserActive) {
            setIsErasing(true);
            handleMouseMove(event.nativeEvent as MouseEvent);
        }
    };

    const stopErasing = () => {
        setIsErasing(false);
    };


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
    }, [isEraserActive, eraserSize, isErasing]);

    return null;
};

export default Eraser;
