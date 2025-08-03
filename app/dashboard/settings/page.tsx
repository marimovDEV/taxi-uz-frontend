"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { apiService, BotSettings, User } from "@/lib/api"
import { getErrorMessage, logApiError } from "@/lib/utils"
import BotTokenInput from "@/components/BotTokenInput"
import BallPricingSettings from "@/components/BallPricingSettings"
import ApiDebugger from "@/components/ApiDebugger"
import LocationManagement from "@/components/LocationManagement"
import GroupSettingsComponent from "@/components/GroupSettings"
import PaymentReminderSettings from "@/components/PaymentReminderSettings"
import PaymentCardManagement from "@/components/PaymentCardManagement"
import { Settings, Bot, User as UserIcon, MessageCircle, Save, RefreshCw, Coins, Globe, Users, Wrench, Bell, CreditCard } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [settings, setSettings] = useState<BotSettings>({
    bot_token: '',
    admin_id: '',
    channel_name: '',
    channel_link: '',
    channel_description: '',
    channel_username: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [userData, settingsData] = await Promise.all([
        apiService.getCurrentUser(),
        apiService.getBotSettings()
      ])
      setUser(userData)
      setSettings(settingsData)
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Ma'lumotlar yuklanmadi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const data = await apiService.getBotSettings()
      setSettings(data)
    } catch (error: any) {
      logApiError(error, 'Settings Fetch')
      
      toast({
        title: "Xatolik ❌",
        description: getErrorMessage(error),
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Log the data being sent (bot token excluded for security)
      const settingsData = {
        admin_id: settings.admin_id,
        channel_name: settings.channel_name,
        channel_link: settings.channel_link
      }
      console.log('Sending bot settings data:', settingsData)
      
      const response = await apiService.updateBotSettings(settingsData)
      
      setSettings(response.settings)
      toast({
        title: "Muvaffaqiyatli ✨",
        description: response.message
      })
    } catch (error: any) {
      logApiError(error, 'Settings Save')
      
      toast({
        title: "Xatolik ❌",
        description: getErrorMessage(error),
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="mobile-title font-bold tracking-tight">Sozlamalar ⚙️</h1>
        <p className="mobile-text text-muted-foreground">
          Bot va tizim sozlamalarini boshqaring
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 mobile-scroll">
          <TabsTrigger value="general" className="mobile-text">Umumiy</TabsTrigger>
          <TabsTrigger value="bot" className="mobile-text">Bot</TabsTrigger>
          <TabsTrigger value="pricing" className="mobile-text">Narxlar</TabsTrigger>
          <TabsTrigger value="locations" className="mobile-text">Manzillar</TabsTrigger>
          <TabsTrigger value="groups" className="mobile-text">Guruhlar</TabsTrigger>
          <TabsTrigger value="payments" className="mobile-text">To'lovlar</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="mobile-card">
            <CardHeader className="mobile-responsive-card">
              <CardTitle className="flex items-center gap-2 mobile-text">
                <UserIcon className="h-4 w-4" />
                Foydalanuvchi ma'lumotlari
              </CardTitle>
              <CardDescription className="mobile-text">
                Joriy foydalanuvchi ma'lumotlari
              </CardDescription>
            </CardHeader>
            <CardContent className="mobile-responsive-card space-y-4">
              {user && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="mobile-text">To'liq ism</Label>
                    <Input 
                      value={user.full_name} 
                      disabled 
                      className="mobile-input"
                    />
                  </div>
                  <div>
                    <Label className="mobile-text">Telefon</Label>
                    <Input 
                      value={user.phone} 
                      disabled 
                      className="mobile-input"
                    />
                  </div>
                  <div>
                    <Label className="mobile-text">Email</Label>
                    <Input 
                      value={user.email || 'Kiritilmagan'} 
                      disabled 
                      className="mobile-input"
                    />
                  </div>
                  <div>
                    <Label className="mobile-text">Rol</Label>
                    <Input 
                      value={user.role} 
                      disabled 
                      className="mobile-input"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bot" className="space-y-4">
          <Card className="mobile-card">
            <CardHeader className="mobile-responsive-card">
              <CardTitle className="flex items-center gap-2 mobile-text">
                <Bot className="h-4 w-4" />
                Bot sozlamalari
              </CardTitle>
              <CardDescription className="mobile-text">
                Telegram bot token va asosiy sozlamalar
              </CardDescription>
            </CardHeader>
            <CardContent className="mobile-responsive-card space-y-4">
              <BotTokenInput />
              
              <Separator />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mobile-text">Admin ID</Label>
                  <Input
                    value={settings.admin_id}
                    onChange={(e) => setSettings({ ...settings, admin_id: e.target.value })}
                    placeholder="Admin ID kiriting"
                    className="mobile-input"
                  />
                </div>
                <div>
                  <Label className="mobile-text">Kanal nomi</Label>
                  <Input
                    value={settings.channel_name}
                    onChange={(e) => setSettings({ ...settings, channel_name: e.target.value })}
                    placeholder="Kanal nomi"
                    className="mobile-input"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="mobile-text">Kanal havolasi</Label>
                  <Input
                    value={settings.channel_link}
                    onChange={(e) => setSettings({ ...settings, channel_link: e.target.value })}
                    placeholder="https://t.me/..."
                    className="mobile-input"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="mobile-button"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={fetchSettings}
                  disabled={loading}
                  className="mobile-button"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Yangilash
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <BallPricingSettings />
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <LocationManagement />
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <GroupSettingsComponent />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="space-y-4">
            <PaymentReminderSettings />
            <PaymentCardManagement />
          </div>
        </TabsContent>
      </Tabs>

      {/* API Debugger */}
      <Card className="mobile-card">
        <CardHeader className="mobile-responsive-card">
          <CardTitle className="flex items-center gap-2 mobile-text">
            <Wrench className="h-4 w-4" />
            API Debugger
          </CardTitle>
          <CardDescription className="mobile-text">
            API so'rovlarini sinab ko'rish va xatolarni tahlil qilish
          </CardDescription>
        </CardHeader>
        <CardContent className="mobile-responsive-card">
          <ApiDebugger />
        </CardContent>
      </Card>
    </div>
  )
}
