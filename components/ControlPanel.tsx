
import React from 'react';
import { useLanguage } from '../i18n';

interface ControlPanelProps {
  isPointCreationMode: boolean;
  isLineMode: boolean;
  isCircleMode: boolean;
  onCreatePoint: () => void;
  onDrawLine: () => void;
  onDrawCircle: () => void;
  onClearBoard: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPointCreationMode,
  isLineMode,
  isCircleMode,
  onCreatePoint,
  onDrawLine,
  onDrawCircle,
  onClearBoard
}) => {
  const { translated } = useLanguage();
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-300 border-b border-gray-700 pb-2">{translated('controls.title')}</h2>
      <div className="space-y-2 pt-2">
        <button
          onClick={onCreatePoint}
          disabled={isPointCreationMode}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {translated('controls.createPoint')}
        </button>
        <button
          onClick={onDrawLine}
          disabled={isLineMode}
          className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {translated('controls.drawLine')}
        </button>
        <button
          onClick={onDrawCircle}
          disabled={isCircleMode}
          className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {translated('controls.drawCircle')}
        </button>
        <button
          onClick={onClearBoard}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors duration-200"
        >
          {translated('controls.clearBoard')}
        </button>
      </div>
    </section>
  );
};

export default ControlPanel;
