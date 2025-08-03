"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/hooks/use-language"
import { useBranding } from "@/hooks/use-branding"
import { Image } from "@/components/ui/image"

export function Header() {
  const { t } = useLanguage()
  const { branding } = useBranding()

  return (
    <header className="mobile-header flex items-center gap-2 sm:gap-4 border-b bg-background">
      <SidebarTrigger className="sm:hidden touch-target" />

      {/* Mobile Logo */}
      <div className="flex items-center gap-2 sm:hidden">
        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center overflow-hidden">
          {branding.logo ? (
            <Image src={branding.logo} alt="Logo" className="w-full h-full" />
          ) : (
            <Menu className="w-3 h-3 text-primary-foreground" />
          )}
        </div>
        <span className="font-semibold text-sm truncate max-w-[120px]">{branding.organizationName}</span>
      </div>

      <div className="flex-1 flex items-center gap-2 sm:gap-4">
        {/* Desktop Search */}
        <div className="relative max-w-md flex-1 hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder={t("search")} className="pl-10 bg-muted/50 mobile-input" />
        </div>

        {/* Mobile Search Button */}
        <Button variant="ghost" size="icon" className="sm:hidden touch-target">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="touch-target h-8 w-8 sm:h-10 sm:w-10">
          <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <LanguageToggle />
        <ModeToggle />
      </div>
    </header>
  )
}
