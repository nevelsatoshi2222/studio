
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

const indianLanguages: (keyof typeof supportedLanguages)[] = ['hi', 'bn', 'mr', 'gu', 'ta'];
const internationalLanguages: (keyof typeof supportedLanguages)[] = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ar', 'ru', 'pt'];


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
      <DialogContent className="sm:max-w-[480px] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Select your language</DialogTitle>
        </DialogHeader>
        <div className="border-t">
           <ScrollArea className="h-[60vh] max-h-96">
            <div className="p-4 space-y-4">

              {/* Indian Languages */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground px-1 mb-2">Indian Languages</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {indianLanguages.map(code => {
                    const language = supportedLanguages[code];
                    return (
                       <button
                        key={code}
                        onClick={() => handleLanguageSelect(code)}
                        className={cn(
                          "flex flex-col items-center justify-center text-center p-2 gap-1 rounded-md transition-colors hover:bg-accent",
                          currentLanguage === code ? 'bg-accent text-accent-foreground' : ''
                        )}
                      >
                        <span className="text-2xl">{language.flag}</span>
                        <span className="text-xs font-medium">{language.nativeName}</span>
                        <span className="text-xs text-muted-foreground">{language.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div className="border-t"></div>

              {/* International Languages */}
               <div>
                <h3 className="text-sm font-semibold text-muted-foreground px-1 mb-2">International Languages</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {internationalLanguages.map(code => {
                    const language = supportedLanguages[code];
                    return (
                       <button
                        key={code}
                        onClick={() => handleLanguageSelect(code)}
                        className={cn(
                          "flex flex-col items-center justify-center text-center p-2 gap-1 rounded-md transition-colors hover:bg-accent",
                          currentLanguage === code ? 'bg-accent text-accent-foreground' : ''
                        )}
                      >
                        <span className="text-2xl">{language.flag}</span>
                        <span className="text-xs font-medium">{language.nativeName}</span>
                        <span className="text-xs text-muted-foreground">{language.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
