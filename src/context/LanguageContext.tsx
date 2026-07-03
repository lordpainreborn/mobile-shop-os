"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'my';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    if (savedLang === 'en' || savedLang === 'my') {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'my' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('app_lang', nextLang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}