// hooks/useTranslation.ts
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/i18n/translations';

export function useTranslation() {
  const { currentLanguage } = useLanguage();

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Split key by dots to handle nested objects
    const keys = key.split('.');
    
    // Navigate through the translation object
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key itself if no translation found
          }
        }
        break;
      }
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