
// components/LanguageSwitcher.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Globe } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage, supportedLanguages, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      <Button variant="outline" disabled>
        <Globe className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  const currentLang = supportedLanguages[currentLanguage];

  const handleLanguageSelect = (languageCode: keyof typeof supportedLanguages) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };
  
  const indianLanguages = Object.entries(supportedLanguages).filter(([code]) => 
    ['hi', 'ta', 'te', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa'].includes(code)
  );

  const internationalLanguages = Object.entries(supportedLanguages).filter(([code]) => 
    !['hi', 'ta', 'te', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa', 'en'].includes(code)
  );

  return (
    <div ref={dropdownRef}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>{currentLang.flag} {currentLang.nativeName}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <ScrollArea className="h-auto max-h-72">
            <div className="p-1">
              <DropdownMenuItem
                  key="en"
                  onClick={() => handleLanguageSelect('en')}
                  className={`flex items-center gap-2 ${
                    currentLanguage === 'en' ? 'bg-accent' : ''
                  }`}
                >
                  <span className="text-lg">{supportedLanguages.en.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{supportedLanguages.en.nativeName}</span>
                    <span className="text-xs text-muted-foreground">{supportedLanguages.en.name}</span>
                  </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuLabel>Indian Languages</DropdownMenuLabel>
              {indianLanguages.map(([code, language]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => handleLanguageSelect(code as any)}
                  className={`flex items-center gap-2 ${
                    currentLanguage === code ? 'bg-accent' : ''
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs text-muted-foreground">{language.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />

              <DropdownMenuLabel>International Languages</DropdownMenuLabel>
              {internationalLanguages.map(([code, language]) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => handleLanguageSelect(code as any)}
                  className={`flex items-center gap-2 ${
                    currentLanguage === code ? 'bg-accent' : ''
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs text-muted-foreground">{language.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
