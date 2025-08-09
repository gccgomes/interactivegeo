
import React from 'react';

interface ColorSelectorProps {
    selectedColor: string;
    onColorChange: (color: string) => void;
}

const COLORS = [
    '#38bdf8', // sky-400
    '#f43f5e', // rose-500
    '#f59e0b', // amber-500
    '#84cc16', // lime-500
    '#22c55e', // green-500
    '#818cf8', // indigo-400
    '#c084fc', // purple-400
    '#f472b6', // pink-400
];

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColor, onColorChange }) => {
    return (
        <div className="grid grid-cols-8 gap-2 pt-2">
            {COLORS.map(color => (
                <button
                    key={color}
                    type="button"
                    onClick={() => onColorChange(color)}
                    className={`w-full h-8 rounded-md transition-all duration-200 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                    aria-pressed={selectedColor === color}
                />
            ))}
        </div>
    );
};

export default ColorSelector;
