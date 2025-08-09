
import React from 'react';
import { useLanguage } from '../i18n';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, translated } = useLanguage();

  const buttonClasses = (lang: 'en' | 'pt') =>
    `flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${
      language === lang
        ? 'bg-indigo-600 text-white shadow-md'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;

  return (
    <section className="space-y-3 pt-6 mt-6 border-t border-gray-700">
      <h2 className="text-xl font-semibold text-gray-300">{translated('language.selector.title')}</h2>
      <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
        <button onClick={() => setLanguage('en')} className={buttonClasses('en')} aria-pressed={language === 'en'}>
          {translated('language.english')}
        </button>
        <button onClick={() => setLanguage('pt')} className={buttonClasses('pt')} aria-pressed={language === 'pt'}>
          {translated('language.portuguese')}
        </button>
      </div>
    </section>
  );
};

export default LanguageSelector;
