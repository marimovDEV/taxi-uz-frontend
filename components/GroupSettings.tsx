"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiService, GroupSettings, GroupSettingsUpdate } from "@/lib/api"
import { Users, Save, RefreshCw } from "lucide-react"

export default function GroupSettingsComponent() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<GroupSettings>({
    admin_group_id: '-1002841507060',
    taxi_parcel_group_id: '-1002862150628',
    avia_train_group_id: '-1002704618595',
    cargo_group_id: '-1002895822694'
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const data = await apiService.getGroupSettings()
      setSettings(data)
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Guruh sozlamalari yuklanmadi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const updateData: GroupSettingsUpdate = {
        admin_group_id: settings.admin_group_id,
        taxi_parcel_group_id: settings.taxi_parcel_group_id,
        avia_train_group_id: settings.avia_train_group_id,
        cargo_group_id: settings.cargo_group_id
      }

      await apiService.updateGroupSettings(updateData)
      
      toast({
        title: "Muvaffaqiyatli",
        description: "Guruh sozlamalari yangilandi"
      })
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Sozlamalar saqlanmadi",
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Guruh ID lari
        </CardTitle>
        <CardDescription>
          Telegram guruh ID larini boshqaring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin_group_id">👨‍💼 Admin Guruhi ID</Label>
            <Input
              id="admin_group_id"
              type="text"
              value={settings.admin_group_id}
              onChange={(e) => setSettings(prev => ({ ...prev, admin_group_id: e.target.value }))}
              placeholder="-1002841507060"
            />
            <p className="text-xs text-muted-foreground">
              Adminlar uchun Telegram guruh ID si (Hozirgi: -1002841507060)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxi_parcel_group_id">🚕📦 Taxi va Pochta Guruhi ID</Label>
            <Input
              id="taxi_parcel_group_id"
              type="text"
              value={settings.taxi_parcel_group_id}
              onChange={(e) => setSettings(prev => ({ ...prev, taxi_parcel_group_id: e.target.value }))}
              placeholder="-1002862150628"
            />
            <p className="text-xs text-muted-foreground">
              Taxi va pochtа haydovchilari uchun Telegram guruh ID si (Hozirgi: -1002862150628)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avia_train_group_id">✈️🚆 Avia va Poyezd Guruhi ID</Label>
            <Input
              id="avia_train_group_id"
              type="text"
              value={settings.avia_train_group_id}
              onChange={(e) => setSettings(prev => ({ ...prev, avia_train_group_id: e.target.value }))}
              placeholder="-1002704618595"
            />
            <p className="text-xs text-muted-foreground">
              Avia va poyezd xizmatlari uchun Telegram guruh ID si (Hozirgi: -1002704618595)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo_group_id">🚛 Gruz Guruhi ID</Label>
            <Input
              id="cargo_group_id"
              type="text"
              value={settings.cargo_group_id}
              onChange={(e) => setSettings(prev => ({ ...prev, cargo_group_id: e.target.value }))}
              placeholder="-1002895822694"
            />
            <p className="text-xs text-muted-foreground">
              Gruz haydovchilari uchun Telegram guruh ID si (Hozirgi: -1002895822694)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <h3 className="text-lg font-medium">Guruh ID larini saqlash</h3>
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

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            💡 Guruh ID sini qanday olish mumkin?
          </h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Telegram da guruh yarating yoki mavjud guruhga kiring</li>
            <li>2. @userinfobot ga guruh havolasini yuboring</li>
            <li>3. Bot sizga guruh ID sini qaytaradi (masalan: -1001234567890)</li>
            <li>4. Bu ID ni yuqoridagi maydonga kiriting</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
} 