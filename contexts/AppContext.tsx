import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Theme, TranslationKey } from '../types';
import { translations } from '../services/translations';

interface AppContextType {
  language: Language;
  theme: Theme;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or default
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as Language) || Language.AR; // Default to Arabic as requested implies standard preference
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('app_theme');
    if (saved) return saved as Theme;
    // Default to DARK mode as requested
    return Theme.DARK;
  });

  // Apply Theme Side Effects
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === Theme.DARK) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Apply Language Side Effects (Direction)
  useEffect(() => {
    const root = window.document.documentElement;
    root.lang = language;
    root.dir = language === Language.AR ? 'rtl' : 'ltr';
    localStorage.setItem('app_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === Language.EN ? Language.AR : Language.EN);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  const t = (key: string): string => {
    const k = key as TranslationKey;
    return translations[language][k] || key;
  };

  const isRTL = language === Language.AR;

  return (
    <AppContext.Provider value={{ language, theme, toggleLanguage, toggleTheme, t, isRTL }}>
      <div className={`min-h-screen font-${language === Language.AR ? 'cairo' : 'sans'}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};