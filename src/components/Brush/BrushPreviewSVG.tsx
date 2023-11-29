// components/BrushPreviewSVG/BrushPreviewSVG.tsx
import React from 'react';

interface BrushPreviewSVGProps {
    width: number;
    height: number;
    brushSize: number;
    brushColor: string;
    mousePosition: {x: number; y: number} | undefined;
    isBrushActive: boolean;
}

const BrushPreviewSVG: React.FC<BrushPreviewSVGProps> = ({
    width,
    height,
    brushSize,
    brushColor,
    mousePosition,
    isBrushActive,
}) => {
    return (
        <svg
            width={width}
            height={height}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
            }}
        >
            {mousePosition && isBrushActive && (
                <circle
                    cx={mousePosition.x}
                    cy={mousePosition.y}
                    r={brushSize / 2}
                    fill={brushColor}
                />
            )}
        </svg>
    );
};

export default BrushPreviewSVG;
