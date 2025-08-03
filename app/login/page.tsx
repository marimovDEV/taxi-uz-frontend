"use client"

import type React from "react"
import { useLanguage } from "@/hooks/use-language"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useBranding } from "@/hooks/use-branding"
import { apiService } from "@/lib/api"

export default function LoginPage() {
  const { t } = useLanguage()
  const { branding } = useBranding()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { token, user } = await apiService.login(username, password)
      
      localStorage.setItem("auth_token", token)
      localStorage.setItem("user_data", JSON.stringify(user))
      
      toast({
        title: t("loginSuccess"),
        description: t("loginWelcome"),
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: t("error"),
        description: error.response?.data?.message || t("loginError"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
            {branding.logo ? (
              <img src={branding.logo || "/placeholder.svg"} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <LogIn className="w-6 h-6 text-primary-foreground" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">{branding.organizationName}</CardTitle>
          <CardDescription>{t("dashboardDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t("username")}</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
              {isLoading ? `${t("login")}...` : t("login")}
            </Button>
          </form>
          {/* Demo credentials removed */}
        </CardContent>
      </Card>
    </div>
  )
}
