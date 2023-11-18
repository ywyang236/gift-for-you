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
        if (context) {
            context.globalCompositeOperation = 'destination-out'; // This sets the eraser mode
            context.beginPath();
            context.arc(x, y, eraserSize / 2, 0, Math.PI * 2);
            context.fill();
            context.closePath();
        }
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isEraserActive || !event) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = event.clientX - (rect?.left ?? 0);
        const y = event.clientY - (rect?.top ?? 0);
        erase(x, y);
    };

    const startErasing = (event: React.MouseEvent<HTMLCanvasElement>) => {
        setIsErasing(true);
        handleMouseMove(event.nativeEvent as MouseEvent);
    };

    const stopErasing = () => {
        setIsErasing(false);
    };


    React.useEffect(() => {
        const canvasElem = canvasRef.current;
        if (canvasElem) {
            canvasElem.addEventListener('mousedown', startErasing as any);
            canvasElem.addEventListener('mouseup', stopErasing);
            canvasElem.addEventListener('mouseleave', stopErasing);
            canvasElem.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            canvasElem?.removeEventListener('mousedown', startErasing as any);
            canvasElem?.removeEventListener('mouseup', stopErasing);
            canvasElem?.removeEventListener('mouseleave', stopErasing);
            canvasElem?.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isEraserActive, eraserSize, isErasing]);

    return null;
};

export default Eraser;
