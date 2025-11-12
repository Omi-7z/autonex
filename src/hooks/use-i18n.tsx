import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getTranslator, translations, Language } from '@/lib/i18n';
type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => any;
};
const I18nContext = createContext<I18nContextType | undefined>(undefined);
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('anx_language');
      return savedLang && savedLang in translations ? (savedLang as Language) : 'en';
    } catch {
      return 'en';
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('anx_language', language);
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, [language]);
  const t = useMemo(() => getTranslator(language), [language]);
  const value = {
    language,
    setLanguage,
    t,
  };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}