"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage, supportedLanguages, isLoading } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (langCode: string) => {
    // Set language globally
    setLanguage(langCode as any)

    // Optional: If you have language-specific routes like /en/about, /hi/about
    // const newPath = pathname.replace(/^\/(en|hi|ta|te|kn|ml|bn|gu|mr|pa|es|fr|de|zh|ja|ar|ru|pt)/, `/${langCode}`);
    // router.replace(newPath);
  }

  if (isLoading) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Globe className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(supportedLanguages).map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name} ({lang.nativeName})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
