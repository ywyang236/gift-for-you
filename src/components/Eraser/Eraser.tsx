// components/Eraser/Eraser.tsx
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/types/storeTypes';

interface EraserProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    width: number;
    height: number;
}

const Eraser: React.FC<EraserProps> = ({canvasRef, width, height}) => {
    const eraserSize = useSelector((state: RootState) => state.eraser.eraserSize);
    const isEraserActive = useSelector((state: RootState) => state.eraser.isEraserActive);

    const erase = (x: number, y: number) => {
        const context = canvasRef.current?.getContext('2d');
        if (context) {
            context.clearRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize);
        }
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isEraserActive) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        const x = event.clientX - (rect?.left ?? 0);
        const y = event.clientY - (rect?.top ?? 0);
        erase(x, y);
    };

    React.useEffect(() => {
        const canvasElem = canvasRef.current;
        if (canvasElem) {
            canvasElem.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            canvasElem?.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isEraserActive, eraserSize]);

    return null;
};

export default Eraser;
