
import React from 'react';
import { useLanguage } from '../i18n';

interface PlotterPanelProps {
    polynomial: string;
    onPolynomialChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPlotPolynomial: () => void;
}

const PlotterPanel: React.FC<PlotterPanelProps> = ({ polynomial, onPolynomialChange, onPlotPolynomial }) => {
    const { translated } = useLanguage();
    return (
        <section className="space-y-4 pt-6 mt-6 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-gray-300">{translated('plotter.title')}</h2>
            <div className="space-y-3 pt-2">
              <label htmlFor="polynomialInput" className="block text-sm font-medium text-gray-400">
                {translated('plotter.label')}
              </label>
              <input
                  id="polynomialInput"
                  type="text"
                  value={polynomial}
                  onChange={onPolynomialChange}
                  onKeyDown={(e) => e.key === 'Enter' && onPlotPolynomial()}
                  placeholder={translated('plotter.placeholder')}
                  aria-label="Function input"
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                  onClick={onPlotPolynomial}
                  className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 transition-colors duration-200"
              >
                  {translated('plotter.button')}
              </button>
              <p className="text-xs text-gray-500 text-center">
                  {translated('plotter.hint')}
              </p>
            </div>
        </section>
    );
};

export default PlotterPanel;
