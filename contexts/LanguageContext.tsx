import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from '../i18n/translations';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi');

  const t = (key: string, replacements?: { [key: string]: string | number }): string => {
    // Fallback logic: current language -> english -> key itself
    let text = (translations[language] && translations[language][key]) || translations['en'][key] || key;
    
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        const regex = new RegExp(`{{${rKey}}}`, 'g');
        text = text.replace(regex, String(replacements[rKey]));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};