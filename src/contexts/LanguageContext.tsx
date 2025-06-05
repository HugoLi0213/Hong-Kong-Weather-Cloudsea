import { NestedTranslationKey, TranslationKey, translations } from '@/lib/i18n';
import React, { createContext, useContext, useState } from 'react';

type Language = 'zh-TW';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string, nested?: NestedTranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh-TW');
  
  const t = (key: TranslationKey | string, nested?: NestedTranslationKey): string => {
    const translation = translations[language];
    
    if (nested && key in translation) {
      const nestedObj = translation[key as keyof typeof translation] as any;
      return nestedObj[nested] || key;
    }
    
    return (translation as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
