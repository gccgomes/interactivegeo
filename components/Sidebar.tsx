
import React from 'react';
import ControlPanel from './ControlPanel';
import PlotterPanel from './PlotterPanel';
import ScalePanel from './ScalePanel';
import HistoryPanel from './HistoryPanel';
import LanguageSelector from './LanguageSelector';
import StylePanel from './StylePanel';
import { HistoryItem } from '../types';
import { useLanguage } from '../i18n';

interface SidebarProps {
  // ControlPanel props
  isPointCreationMode: boolean;
  isLineMode: boolean;
  isCircleMode: boolean;
  onCreatePoint: () => void;
  onDrawLine: () => void;
  onDrawCircle: () => void;
  onClearBoard: () => void;

  // StylePanel props
  selectedColor: string;
  onColorChange: (color: string) => void;

  // PlotterPanel props
  polynomial: string;
  onPolynomialChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlotPolynomial: () => void;

  // ScalePanel props
  xScale: number;
  yScale: number;
  onXScaleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onYScaleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetScale: () => void;
  
  // HistoryPanel props
  history: HistoryItem[];
  onDeleteItem: (id: string) => void;
  onHighlightItem: (id: string) => void;
  onUnhighlightItem: (id: string) => void;
  
  // Other props
  promptText: string;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { translated } = useLanguage();
  
  return (
    <aside className="w-80 flex-shrink-0 bg-gray-900 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
      <div>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">{translated('sidebar.title')}</h1>
          <p className="text-indigo-400 mt-1">{translated('sidebar.subtitle')}</p>
        </header>

        <ControlPanel
          isPointCreationMode={props.isPointCreationMode}
          isLineMode={props.isLineMode}
          isCircleMode={props.isCircleMode}
          onCreatePoint={props.onCreatePoint}
          onDrawLine={props.onDrawLine}
          onDrawCircle={props.onDrawCircle}
          onClearBoard={props.onClearBoard}
        />

        <StylePanel
          selectedColor={props.selectedColor}
          onColorChange={props.onColorChange}
        />

        <PlotterPanel
            polynomial={props.polynomial}
            onPolynomialChange={props.onPolynomialChange}
            onPlotPolynomial={props.onPlotPolynomial}
        />

        <ScalePanel
            xScale={props.xScale}
            yScale={props.yScale}
            onXScaleChange={props.onXScaleChange}
            onYScaleChange={props.onYScaleChange}
            onResetScale={props.onResetScale}
        />

        <HistoryPanel
            history={props.history}
            onDeleteItem={props.onDeleteItem}
            onHighlightItem={props.onHighlightItem}
            onUnhighlightItem={props.onUnhighlightItem}
        />
        
        <LanguageSelector />
      </div>

      <div className="flex-shrink-0 pt-6">
          <p className="text-gray-400 text-sm h-10 flex items-center justify-center text-center">
             {props.promptText}
          </p>
          <footer className="text-center text-gray-500 text-xs mt-4">
            <p>Rodapé</p>
          </footer>
      </div>
    </aside>
  );
};

export default Sidebar;
