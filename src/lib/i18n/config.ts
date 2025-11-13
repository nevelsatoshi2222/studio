// lib/i18n/config.ts
export const supportedLanguages = {
    en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
    hi: { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    kn: { name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    ml: { name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
    mr: { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    gu: { name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  } as const;
  
  export type LanguageCode = keyof typeof supportedLanguages;