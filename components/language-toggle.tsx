"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { Languages } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="touch-target">
          <Languages className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mobile-modal">
        <DropdownMenuItem 
          onClick={() => setLocale("uz")} 
          className={`mobile-text ${locale === "uz" ? "bg-accent" : ""}`}
        >
          🇺🇿 O'zbekcha
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLocale("ru")} 
          className={`mobile-text ${locale === "ru" ? "bg-accent" : ""}`}
        >
          🇷🇺 Русский
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
