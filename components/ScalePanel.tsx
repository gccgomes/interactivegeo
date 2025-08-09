
import React from 'react';
import { useLanguage } from '../i18n';

interface ScalePanelProps {
    xScale: number;
    yScale: number;
    onXScaleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onYScaleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onResetScale: () => void;
}

const ScalePanel: React.FC<ScalePanelProps> = ({ xScale, yScale, onXScaleChange, onYScaleChange, onResetScale }) => {
    const { translated } = useLanguage();
    return (
        <section className="space-y-4 pt-6 mt-6 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-300">{translated('scale.title')}</h2>
              <button
                onClick={onResetScale}
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 rounded px-2 py-1"
                aria-label="Reset axis scale to default"
              >
                {translated('scale.reset')}
              </button>
            </div>
            <div className="space-y-4 pt-2">
              <div>
                <label htmlFor="xScale" className="flex justify-between text-sm font-medium text-gray-400 mb-1">
                  <span>{translated('scale.xAxis')}</span>
                  <span>{xScale.toFixed(1)}x</span>
                </label>
                <input
                  id="xScale"
                  type="range"
                  min="0.2"
                  max="5"
                  step="0.1"
                  value={xScale}
                  onChange={onXScaleChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  aria-label="X-axis scale"
                />
              </div>
              <div>
                <label htmlFor="yScale" className="flex justify-between text-sm font-medium text-gray-400 mb-1">
                  <span>{translated('scale.yAxis')}</span>
                  <span>{yScale.toFixed(1)}x</span>
                </label>
                <input
                  id="yScale"
                  type="range"
                  min="0.2"
                  max="5"
                  step="0.1"
                  value={yScale}
                  onChange={onYScaleChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  aria-label="Y-axis scale"
                />
              </div>
            </div>
        </section>
    );
};

export default ScalePanel;
