
// hooks/useTranslation.ts
import { useLanguage } from '@/contexts/LanguageContext';

export function useTranslation() {
  const { currentLanguage, translations } = useLanguage();

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Check if translations are loaded
    if (!translations || Object.keys(translations).length === 0) {
      return key; // Return key if translations are not ready
    }

    // Default to English translations if the current language doesn't exist
    const langTranslations = translations[currentLanguage] || translations.en;
    const englishTranslations = translations.en;
    
    // Split key by dots to handle nested objects
    const keys = key.split('.');
    
    let value: any = langTranslations;
    let fallbackValue: any = englishTranslations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // If key not found in current language, search in English
        value = undefined; // Mark as not found
        break;
      }
    }

    // If not found in current language, try English fallback
    if (value === undefined) {
      for (const k of keys) {
        if (fallbackValue && typeof fallbackValue === 'object' && k in fallbackValue) {
          fallbackValue = fallbackValue[k];
        } else {
          return key; // Return key itself if not found in English either
        }
      }
      value = fallbackValue;
    }

    // If we have a string value, replace parameters
    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce((str, [param, val]) => {
        return str.replace(`{{${param}}}`, String(val));
      }, value);
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, currentLanguage };
}
