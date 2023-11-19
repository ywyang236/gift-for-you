// src/components/Canvas/BackgroundHighlighter.tsx
import React, {useState} from 'react';

interface BackgroundHighlighterProps {
    width: number;
    height: number;
    active: boolean;
    children?: React.ReactNode;
}

const BackgroundHighlighter: React.FC<BackgroundHighlighterProps> = ({width, height, active, children}) => {
    const backgroundColor = active ? 'rgba(255, 139, 0, 0.3)' : 'transparent';

    return (
        <div style={{width, height, backgroundColor}}>
            {children}
        </div>
    );
};

export default BackgroundHighlighter;
