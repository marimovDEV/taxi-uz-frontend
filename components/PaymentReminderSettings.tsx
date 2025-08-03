"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { apiService } from '@/lib/api'
import { getErrorMessage, logApiError } from '@/lib/utils'
import { Calendar, Bell, Save, RefreshCw } from 'lucide-react'

interface PaymentReminderSettings {
  reminder_day: number
  is_active: boolean
  last_sent: string | null
}

export default function PaymentReminderSettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<PaymentReminderSettings>({
    reminder_day: 1,
    is_active: true,
    last_sent: null
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const data = await apiService.getPaymentReminderSettings()
      setSettings(data)
    } catch (error: any) {
      logApiError(error, 'Payment Reminder Settings Fetch')
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
      
      const response = await apiService.updatePaymentReminderSettings({
        reminder_day: settings.reminder_day,
        is_active: settings.is_active
      })
      
      setSettings(response.settings)
      toast({
        title: "Muvaffaqiyatli ✨",
        description: response.message
      })
    } catch (error: any) {
      logApiError(error, 'Payment Reminder Settings Save')
      toast({
        title: "Xatolik ❌",
        description: getErrorMessage(error),
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTestReminder = async () => {
    try {
      setSaving(true)
      await apiService.testPaymentReminder()
      toast({
        title: "Test xabar yuborildi ✨",
        description: "Admin guruhiga test xabar yuborildi"
      })
    } catch (error: any) {
      logApiError(error, 'Test Payment Reminder')
      toast({
        title: "Xatolik ❌",
        description: getErrorMessage(error),
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const validateDay = (day: number) => {
    if (day < 1) return 1
    if (day > 31) return 31
    return day
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Oylik To'lov Eslatmasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Oylik To'lov Eslatmasi
        </CardTitle>
        <CardDescription>
          Har oy belgilangan sanada admin guruhiga to'lov eslatmasi yuborish
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Eslatma kuni */}
        <div className="space-y-2">
          <Label htmlFor="reminder_day" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Eslatma kuni (1-31)
          </Label>
          <Input
            id="reminder_day"
            type="number"
            min="1"
            max="31"
            value={settings.reminder_day}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              reminder_day: validateDay(parseInt(e.target.value) || 1)
            }))}
            placeholder="1-31 oralig'ida kun kiriting"
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground">
            Har oyning {settings.reminder_day}-kunida admin guruhiga xabar yuboriladi
          </p>
        </div>

        {/* Faol/faol emas */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Eslatma faol</Label>
            <p className="text-sm text-muted-foreground">
              Oylik to'lov eslatmalarini yuborish
            </p>
          </div>
          <Switch
            checked={settings.is_active}
            onCheckedChange={(checked) => setSettings(prev => ({
              ...prev,
              is_active: checked
            }))}
          />
        </div>

        {/* Oxirgi yuborilgan sana */}
        {settings.last_sent && (
          <div className="space-y-2">
            <Label>Oxirgi yuborilgan sana</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(settings.last_sent).toLocaleString('uz-UZ')}
            </p>
          </div>
        )}

        {/* Tugmalar */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleTestReminder}
            disabled={saving || !settings.is_active}
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Test xabar
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={fetchSettings}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Yangilash
          </Button>
        </div>

        {/* Ma'lumot */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            ℹ️ Qanday ishlaydi?
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Har oyning {settings.reminder_day}-kunida avtomatik xabar yuboriladi</li>
            <li>• Xabar admin guruhiga yuboriladi</li>
            <li>• Server to'lovi haqida eslatma beradi</li>
            <li>• Test xabar orqali sinab ko'rishingiz mumkin</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 