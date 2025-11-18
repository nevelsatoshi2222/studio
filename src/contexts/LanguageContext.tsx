'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode = 
  | 'en' // English
  | 'hi' // Hindi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'bn' // Bengali
  | 'gu' // Gujarati
  | 'mr' // Marathi
  | 'pa' // Punjabi
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'zh' // Chinese
  | 'ja' // Japanese
  | 'ar' // Arabic
  | 'ru' // Russian
  | 'pt'; // Portuguese

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  fontFamily: string;
}

export const supportedLanguages: Record<LanguageCode, Language> = {
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', fontFamily: 'Inter' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', fontFamily: 'Noto Sans Devanagari' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', fontFamily: 'Noto Sans Tamil' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', fontFamily: 'Noto Sans Telugu' },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', fontFamily: 'Noto Sans Kannada' },
  ml: { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', fontFamily: 'Noto Sans Malayalam' },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', fontFamily: 'Noto Sans Bengali' },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', fontFamily: 'Noto Sans Gujarati' },
  mr: { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', fontFamily: 'Noto Sans Devanagari' },
  pa: { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', fontFamily: 'Noto Sans Gurmukhi' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', fontFamily: 'Inter' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', fontFamily: 'Inter' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', fontFamily: 'Inter' },
  zh: { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', fontFamily: 'Noto Sans SC' },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', fontFamily: 'Noto Sans JP' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', fontFamily: 'Noto Sans Arabic' },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', fontFamily: 'Inter' },
  pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', fontFamily: 'Inter' },
};

// Translation dictionary
const translations = {
  en: {
    common: {
      welcome: 'Public Governance',
      loading: 'Loading...',
    },
    navigation: {
      votingSystem: 'Voting System',
      worldPerspective: 'World Perspective',
      newIndia: 'New India Vision',
      quiz: 'Quiz & Opinion',
      polls: 'Opinion Polls',
      madeWithLove: 'Made with ❤️ for better governance',
      allRightsReserved: 'All rights reserved',
    },
    voting: {
      internationalIssues: 'International Issues',
      nationalIssues: 'National Issues',
      stateIssues: 'State Issues',
      districtIssues: 'District Issues',
      talukaIssues: 'Taluka Issues',
      villageIssues: 'Village Issues',
      streetIssues: 'Street Issues',
    },
    footer: {
      quickLinks: 'Quick Links',
      resources: 'Resources',
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      contactEmail: 'contact@governance.org',
      contactPhone: '+91-XXXXX-XXXXX',
    },
  },
  hi: {
    common: {
      welcome: 'सार्वजनिक शासन',
      loading: 'लोड हो रहा है...',
    },
    navigation: {
      votingSystem: 'मतदान प्रणाली',
      worldPerspective: 'वैश्विक परिप्रेक्ष्य',
      newIndia: 'नए भारत की दृष्टि',
      quiz: 'क्विज और राय',
      polls: 'जनमत सर्वेक्षण',
      madeWithLove: 'बेहतर शासन के लिए ❤️ से बनाया गया',
      allRightsReserved: 'सर्वाधिकार सुरक्षित',
    },
    voting: {
      internationalIssues: 'अंतर्राष्ट्रीय मुद्दे',
      nationalIssues: 'राष्ट्रीय मुद्दे',
      stateIssues: 'राज्य के मुद्दे',
      districtIssues: 'जिला मुद्दे',
      talukaIssues: 'तालुका मुद्दे',
      villageIssues: 'गाँव के मुद्दे',
      streetIssues: 'सड़क मुद्दे',
    },
    footer: {
      quickLinks: 'त्वरित लिंक',
      resources: 'संसाधन',
      aboutUs: 'हमारे बारे में',
      contactUs: 'संपर्क करें',
      privacyPolicy: 'गोपनीयता नीति',
      termsOfService: 'सेवा की शर्तें',
      contactEmail: 'contact@governance.org',
      contactPhone: '+91-XXXXX-XXXXX',
    },
  },
  ta: {
    common: {
      welcome: 'பொது ஆட்சி',
      loading: 'லோட் ஆகிறது...',
    },
    navigation: {
      votingSystem: 'வாக்களிப்பு அமைப்பு',
      worldPerspective: 'உலக முன்னோக்கு',
      newIndia: 'புதிய இந்திய பார்வை',
      quiz: 'வினாடி வினா & கருத்து',
      polls: 'கருத்துக் கணிப்பு',
      madeWithLove: 'சிறந்த ஆட்சிக்காக ❤️ உருவாக்கப்பட்டது',
      allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை',
    },
    voting: {
      internationalIssues: 'சர்வதேச பிரச்சினைகள்',
      nationalIssues: 'தேசிய பிரச்சினைகள்',
      stateIssues: 'மாநில பிரச்சினைகள்',
      districtIssues: 'மாவட்ட பிரச்சினைகள்',
      talukaIssues: 'தாலுகா பிரச்சினைகள்',
      villageIssues: 'கிராம பிரச்சினைகள்',
      streetIssues: 'தெரு பிரச்சினைகள்',
    },
    footer: {
      quickLinks: 'விரைவு இணைப்புகள்',
      resources: 'வளங்கள்',
      aboutUs: 'எங்களைப் பற்றி',
      contactUs: 'தொடர்பு கொள்ளுங்கள்',
      privacyPolicy: 'தனியுரிமைக் கொள்கை',
      termsOfService: 'சேவை விதிமுறைகள்',
      contactEmail: 'contact@governance.org',
      contactPhone: '+91-XXXXX-XXXXX',
    },
  },
  // Add more language translations as needed...
};

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  supportedLanguages: Record<LanguageCode, Language>;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('preferred-language') as LanguageCode;
    if (savedLanguage && supportedLanguages[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
    setIsLoading(false);
  }, []);

  const setLanguage = (language: LanguageCode) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
    
    // Update HTML lang attribute
    document.documentElement.lang = language;
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English if translation not found
        value = translations.en;
        for (const k of keys) {
          value = value?.[k];
        }
        break;
      }
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      supportedLanguages, 
      t,
      isLoading 
    }}>
      <div style={{ fontFamily: supportedLanguages[currentLanguage].fontFamily }}>
        {children}
      </div>
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