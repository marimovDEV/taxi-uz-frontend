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
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sozlamalar</h1>
        <p className="text-muted-foreground">
          Bot va admin panel sozlamalarini boshqaring
        </p>
      </div>

      <Tabs defaultValue="bot" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="bot" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Bot
          </TabsTrigger>
          {user?.role === 'admin' && (
            <>
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Ball Narxlari
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Davlat/Viloyat/Shahar
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Guruh ID lari
              </TabsTrigger>
              <TabsTrigger value="cards" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                To'lov Kartalari
              </TabsTrigger>
              <TabsTrigger value="reminder" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Eslatma
              </TabsTrigger>
              <TabsTrigger value="debug" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Debug
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="bot" className="space-y-6">
          <div className="grid gap-6">
            {/* Bot Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Bot Sozlamalari
                </CardTitle>
                <CardDescription>
                  Telegram bot token va admin ID sozlamalari
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bot_token">Bot Token</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="bot_token"
                      type="password"
                      value={settings.bot_token}
                      disabled
                      className="bg-muted font-mono text-sm"
                      placeholder="Bot token ko'rsatilmoqda..."
                    />
                    <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                      🔒 O'zgarmaydi
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bot token xavfsizlik uchun o'zgartirish mumkin emas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_id">Admin ID</Label>
                  <Input
                    id="admin_id"
                    type="text"
                    value={settings.admin_id}
                    onChange={(e) => setSettings(prev => ({ ...prev, admin_id: e.target.value }))}
                    placeholder="Admin Telegram ID(lar)ini kiriting, masalan: 5233406235,1212795522"
                  />
                  <p className="text-xs text-muted-foreground">
                    Bir nechta admin uchun vergul bilan ajrating: <b>5233406235,1212795522</b>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Channel Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Kanal Sozlamalari
                </CardTitle>
                <CardDescription>
                  Telegram kanal ma'lumotlari
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="channel_name">Kanal Nomi</Label>
                    <Input
                      id="channel_name"
                      value={settings.channel_name}
                      onChange={(e) => setSettings(prev => ({ ...prev, channel_name: e.target.value }))}
                      placeholder="@kanal_nomi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="channel_link">Kanal Havolasi</Label>
                    <Input
                      id="channel_link"
                      value={settings.channel_link}
                      onChange={(e) => setSettings(prev => ({ ...prev, channel_link: e.target.value }))}
                      placeholder="https://t.me/kanal_nomi"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Kanal Tavsifi</Label>
                  <Input
                    value={settings.channel_description}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Kanal Username</Label>
                  <Input
                    value={settings.channel_username}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Sozlamalarni saqlash</h3>
                    <p className="text-sm text-muted-foreground">
                      Barcha o'zgarishlar saqlanadi va bot to'xtatiladi
                    </p>
                  </div>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saqlanmoqda...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Saqlash
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {user?.role === 'admin' && (
          <>
            <TabsContent value="pricing">
              <BallPricingSettings />
            </TabsContent>

            <TabsContent value="location">
              <LocationManagement />
            </TabsContent>

            <TabsContent value="groups">
              <GroupSettingsComponent />
            </TabsContent>

            <TabsContent value="cards">
              <PaymentCardManagement />
            </TabsContent>

            <TabsContent value="reminder">
              <PaymentReminderSettings />
            </TabsContent>

            <TabsContent value="debug">
              <ApiDebugger />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
