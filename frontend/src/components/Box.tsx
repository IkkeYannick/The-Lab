import React from 'react';

type BoxProps = {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    id: string;
    onDelete: (id: string) => void;
};

const Box: React.FC<BoxProps> = ({ startX, startY, endX, endY, id, onDelete }) => {
    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const width = Math.abs(startX - endX);
    const height = Math.abs(startY - endY);

    return (
        <div
            className="absolute border-2 border-blue-500 group"
            style={{
                top: y,
                left: x,
                width,
                height
            }}
        >
            {/* Delete button */}
            <button
                onClick={() => onDelete(id)}
                className="absolute -top-2 -right-2 hidden group-hover:block bg-white text-black text-xs rounded-full px-1 border border-gray-400"
            >
                ✕
            </button>
        </div>
    );
};

export default Box;
