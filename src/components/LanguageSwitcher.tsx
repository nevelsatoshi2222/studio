// components/LanguageSwitcher.tsx
'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage, supportedLanguages, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <Globe className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  const currentLang = supportedLanguages[currentLanguage];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLang.flag} {currentLang.nativeName}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(supportedLanguages).map(([code, language]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => {
              setLanguage(code as any);
              setIsOpen(false);
            }}
            className={`flex items-center gap-2 ${
              currentLanguage === code ? 'bg-blue-50 text-blue-700' : ''
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-gray-500">{language.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}