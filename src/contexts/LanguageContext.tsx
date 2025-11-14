
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Curated list of important languages as requested
export const supportedLanguages = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  hi: { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  mr: { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  ml: { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
} as const;


export type LanguageCode = keyof typeof supportedLanguages;

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  supportedLanguages: typeof supportedLanguages;
  isLoading: boolean;
  translations: any; // Add translations to the context
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    async function initializeLanguage() {
      setIsLoading(true);
      try {
        const { translations } = await import('@/lib/i18n/translations');
        setTranslations(translations);
        
        const savedLanguage = (localStorage.getItem('preferred-language') as LanguageCode) || 'en';
        if (supportedLanguages[savedLanguage]) {
          setCurrentLanguage(savedLanguage);
          document.documentElement.lang = savedLanguage;
        } else {
          setCurrentLanguage('en');
          document.documentElement.lang = 'en';
        }

      } catch (error) {
        console.error('Failed to load translations', error);
        // Fallback to English if translations fail
        setCurrentLanguage('en');
        document.documentElement.lang = 'en';
      } finally {
        setIsLoading(false);
      }
    }
    
    initializeLanguage();
  }, []);

  const setLanguage = useCallback((language: LanguageCode) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
    document.documentElement.lang = language;
  }, []);

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    supportedLanguages,
    isLoading,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
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
