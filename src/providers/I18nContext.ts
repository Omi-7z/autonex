import { createContext } from 'react';
import type { Language } from '@/lib/i18n';
type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => any;
};
export const I18nContext = createContext<I18nContextType | undefined>(undefined);