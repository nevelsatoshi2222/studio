'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage, supportedLanguages, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-500">
        <span className="w-5 h-5">🌐</span>
        <span>Loading...</span>
      </div>
    );
  }

  const currentLang = supportedLanguages[currentLanguage];

  const handleLanguageSelect = (languageCode: keyof typeof supportedLanguages) => {
    setLanguage(languageCode);
    setIsOpen(false);
    console.log('Language changed to:', languageCode); // Debug log
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 border border-gray-300 rounded-lg hover:border-blue-300 bg-white"
      >
        <span className="w-5 h-5">{currentLang.flag}</span>
        <span>{currentLang.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">
              Indian Languages
            </div>
            {Object.entries(supportedLanguages).filter(([code]) => 
              ['hi', 'ta', 'te', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa'].includes(code)
            ).map(([code, language]) => (
              <button
                key={code}
                className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 transition-colors duration-150 rounded-md ${
                  currentLanguage === code 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleLanguageSelect(code as keyof typeof supportedLanguages)}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-xs text-gray-500">{language.name}</span>
                </div>
              </button>
            ))}
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">
              International Languages
            </div>
            {Object.entries(supportedLanguages).filter(([code]) => 
              !['hi', 'ta', 'te', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa', 'en'].includes(code)
            ).map(([code, language]) => (
              <button
                key={code}
                className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 transition-colors duration-150 rounded-md ${
                  currentLanguage === code 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleLanguageSelect(code as keyof typeof supportedLanguages)}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-xs text-gray-500">{language.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}