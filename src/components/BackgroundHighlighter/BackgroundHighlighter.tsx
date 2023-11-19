// src/components/BackgroundHighlighter/BackgroundHighlighter.tsx
import React, {useState} from 'react';

interface BackgroundHighlighterProps {
    width: number;
    height: number;
    active: boolean;
    children?: React.ReactNode;
}

const BackgroundHighlighter: React.FC<BackgroundHighlighterProps> = ({width, height, active, children}) => {
    const [backgroundColor, setBackgroundColor] = useState('transparent');

    const toggleBackgroundColor = () => {
        setBackgroundColor(prevColor =>
            prevColor === 'transparent' ? 'rgba(255, 139, 0, 0.3)' : 'transparent'
        );
    };

    return (
        <div style={{width, height, backgroundColor: active ? backgroundColor : 'transparent'}} onClick={toggleBackgroundColor}>
            {children}
        </div>
    );
};

export default BackgroundHighlighter;
