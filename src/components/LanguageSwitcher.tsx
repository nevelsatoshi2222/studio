// components/LanguageSwitcher.tsx
'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const handleLanguageSelect = (languageCode: keyof typeof supportedLanguages) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLang.flag} {currentLang.nativeName}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Select your language</DialogTitle>
        </DialogHeader>
        <div className="border-t">
          <ScrollArea className="h-[60vh] md:h-[50vh]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4">
              {Object.entries(supportedLanguages).map(([code, language]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageSelect(code as any)}
                  className={cn(
                    "flex flex-col items-center justify-center text-center p-3 gap-2 rounded-md transition-colors hover:bg-accent",
                    currentLanguage === code ? 'bg-accent text-accent-foreground' : ''
                  )}
                >
                  <span className="text-3xl">{language.flag}</span>
                  <span className="text-sm font-medium">{language.nativeName}</span>
                  <span className="text-xs text-muted-foreground">{language.name}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
