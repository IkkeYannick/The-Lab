import React from 'react';

type PinProps = {
    x: number;
    y: number;
    id: string;
    onDelete: (id: string) => void;
};

const Pin: React.FC<PinProps> = ({ x, y, id, onDelete }) => {
    return (
        <div
            className="absolute"
            style={{ top: y - 5, left: x - 5 }} // Centering the pin
        >
            <div className="relative group">
                {/* Red dot */}
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>

                {/* Delete button, visible on hover */}
                <button
                    onClick={() => onDelete(id)}
                    className="absolute -top-2 -right-2 hidden group-hover:block bg-white text-black text-lg rounded-full px-1 border border-gray-400"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default Pin;
