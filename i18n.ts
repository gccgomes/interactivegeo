
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'pt' | 'en';

const translations = {

  pt: {
    'sidebar.title': 'Geometria Demo',
    'sidebar.subtitle': 'Demo do JSXGraph com React',
    'prompt.selectPointForCircle': (n: number) => `Selecione o ponto ${n} de 3 para o círculo.`,
    'prompt.selectPointForLine': (n: number) => `Selecione o ponto ${n} de 2 para a linha.`,
    'prompt.createPoint': 'Clique na grade para criar um ponto.',
    'prompt.default': 'Selecione um objeto ou escolha uma ação.',
    'controls.title': 'Controles',
    'controls.createPoint': 'Criar Ponto',
    'controls.drawLine': 'Desenhar Linha (2 pontos)',
    'controls.drawCircle': 'Desenhar Círculo (3 pontos)',
    'controls.clearBoard': 'Limpar Painel',
    'style.title': 'Cor do Objeto',
    'plotter.title': 'Plotar Função',
    'plotter.label': 'f(x) =',
    'plotter.placeholder': 'ex: x^2 / 2 - 1',
    'plotter.button': 'Plotar Função',
    'plotter.hint': 'Use `^` para potências. Constantes e, pi, phi estão disponíveis. ex: `sin(pi*x)`',
    'plotter.error.alert': (expr: string, processedExpr: string) => `Não foi possível plotar a função "${expr}".\nFoi interpretada como "${processedExpr}", que é inválida.\nPor favor, verifique erros de sintaxe.`,
    'scale.title': 'Escala dos Eixos',
    'scale.reset': 'Redefinir',
    'scale.xAxis': 'Eixo X',
    'scale.yAxis': 'Eixo Y',
    'history.title': 'Histórico',
    'history.empty': 'Nenhum objeto criado ainda.',
    'history.item.point': (x: string, y: string) => `Ponto (${x}, ${y})`,
    'history.item.line': 'Linha',
    'history.item.circle': 'Círculo',
    'history.item.function': (poly: string) => `f(x) = ${poly}`,
    'delete.ariaLabel': (name: string) => `Excluir ${name}`,
    'language.selector.title': 'Idioma',
    'language.english': 'English',
    'language.portuguese': 'Português',
  },
    en: {
    'sidebar.title': 'Geometry Pad',
    'sidebar.subtitle': 'JSXGraph and React Demo',
    'prompt.selectPointForCircle': (n: number) => `Select point ${n} of 3 for the circle.`,
    'prompt.selectPointForLine': (n: number) => `Select point ${n} of 2 for the line.`,
    'prompt.createPoint': 'Click on the grid to create a point.',
    'prompt.default': 'Select an object or choose an action.',
    'controls.title': 'Controls',
    'controls.createPoint': 'Create Point',
    'controls.drawLine': 'Draw Line (2 points)',
    'controls.drawCircle': 'Draw Circle (3 points)',
    'controls.clearBoard': 'Clear Board',
    'style.title': 'Object Collor',
    'plotter.title': 'Plot Function',
    'plotter.label': 'f(x) =',
    'plotter.placeholder': 'e.g., x^2 / 2 - 1',
    'plotter.button': 'Plot Function',
    'plotter.hint': 'Use `^` for powers. Constants e, pi, phi are available. e.g., `sin(pi*x)`',
    'plotter.error.alert': (expr: string, processedExpr: string) => `Could not plot function "${expr}".\nIt was interpreted as "${processedExpr}", which is invalid.\nPlease check for syntax errors.`,
    'scale.title': 'Axis Scale',
    'scale.reset': 'Reset',
    'scale.xAxis': 'X-Axis',
    'scale.yAxis': 'Y-Axis',
    'history.title': 'History',
    'history.empty': 'No objects created yet.',
    'history.item.point': (x: string, y: string) => `Point (${x}, ${y})`,
    'history.item.line': 'Line',
    'history.item.circle': 'Circle',
    'history.item.function': (poly: string) => `f(x) = ${poly}`,
    'delete.ariaLabel': (name: string) => `Delete ${name}`,
    'language.selector.title': 'Language',
    'language.english': 'English',
    'language.portuguese': 'Português',
  }
};

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translated: (key: TranslationKey, ...args: any[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const translated = (key: TranslationKey, ...args: any[]): string => {
    let translation = translations[language]?.[key];

    // Fallback to English if translation is not found in the current language.
    if (translation === undefined) {
      translation = translations.en[key];
    }

    // If the determined translation (current lang or fallback) is a function, call it.
    if (typeof translation === 'function') {
      return (translation as (...args: any[]) => string)(...args);
    }
    
    // If it's a non-null, non-undefined value, return it as a string.
    if (translation !== null && translation !== undefined) {
      return String(translation);
    }
    
    // As a final fallback, return the key itself.
    return String(key);
  };

  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, translated } }, children);
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
