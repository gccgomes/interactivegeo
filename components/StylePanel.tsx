
import React from 'react';
import { useLanguage } from '../i18n';
import ColorSelector from './ColorSelector';

interface StylePanelProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const StylePanel: React.FC<StylePanelProps> = ({ selectedColor, onColorChange }) => {
  const { translated } = useLanguage();
  return (
    <section className="space-y-4 pt-6 mt-6 border-t border-gray-700">
      <h2 className="text-xl font-semibold text-gray-300">{translated('style.title')}</h2>
      <ColorSelector selectedColor={selectedColor} onColorChange={onColorChange} />
    </section>
  );
};

export default StylePanel;
