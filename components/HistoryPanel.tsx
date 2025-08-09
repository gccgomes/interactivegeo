
import React from 'react';
import { HistoryItem } from '../types';
import { useLanguage } from '../i18n';

interface HistoryPanelProps {
    history: HistoryItem[];
    onDeleteItem: (id: string) => void;
    onHighlightItem: (id: string) => void;
    onUnhighlightItem: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onDeleteItem, onHighlightItem, onUnhighlightItem }) => {
    const { translated } = useLanguage();
    return (
        <section className="space-y-4 pt-6 mt-6 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-gray-300">{translated('history.title')}</h2>
            <div className="space-y-2 pt-2 mt-2 max-h-60 overflow-y-auto bg-gray-800/50 rounded-lg p-2 custom-scrollbar">
              {history.length > 0 ? (
                <ul className="space-y-1">
                  {history.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between bg-gray-700/50 p-2 rounded-lg hover:bg-gray-700/80 transition-colors duration-200 group"
                      onMouseEnter={() => onHighlightItem(item.id)}
                      onMouseLeave={() => onUnhighlightItem(item.id)}
                    >
                      <span className="text-sm text-gray-300 truncate pr-2">{item.name}</span>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="text-red-500 hover:text-red-400 font-bold text-lg leading-none p-1 rounded-full flex-shrink-0 w-6 h-6 flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={translated('delete.ariaLabel', item.name)}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">{translated('history.empty')}</p>
              )}
            </div>
        </section>
    );
};

export default HistoryPanel;
