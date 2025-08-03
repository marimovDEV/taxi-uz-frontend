"use client"

import { Car, CreditCard, Package, Settings, BarChart3, Users, Home, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useLanguage } from "@/hooks/use-language"
import { useBranding } from "@/hooks/use-branding"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Image } from "@/components/ui/image"

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const { t } = useLanguage()
  const { branding } = useBranding()

  const menuItems = [
    {
      title: t("dashboard"),
      url: "/dashboard",
      icon: Home,
    },
    {
      title: t("payments"),
      url: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      title: t("orders"),
      url: "/dashboard/orders",
      icon: Package,
    },
    {
      title: t("settings"),
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: t("statistics"),
      url: "/dashboard/statistics",
      icon: BarChart3,
    },
    {
      title: t("driverRatings"),
      url: "/dashboard/ratings",
      icon: Car,
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    toast({
      title: t("logout"),
      description: t("logoutSuccess"),
    })
    router.push("/login")
  }

  return (
    <Sidebar collapsible="icon" className="mobile-sidebar border-r">
      <SidebarHeader className="border-b mobile-padding">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
            {branding.logo ? (
              <Image src={branding.logo} alt="Logo" className="w-full h-full" />
            ) : (
              <Car className="w-4 h-4 text-primary-foreground" />
            )}
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="font-semibold mobile-text">{branding.organizationName}</h2>
            <p className="text-xs text-muted-foreground">{t("dashboard")}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mobile-text">{t("mainSections")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url} 
                    tooltip={item.title}
                    className="touch-target"
                  >
                    <a href={item.url} className="mobile-text">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t mobile-padding">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 touch-target mobile-text"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">{t("logout")}</span>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
